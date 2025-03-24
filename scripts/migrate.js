require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigrations() {
  let client;
  try {
    console.log('Connecting to database...');
    console.log('Using connection string:', process.env.DATABASE_URL);
    client = await pool.connect();

    console.log('Running database migrations...');

    // Drop existing tables and functions with proper order
    await client.query(`
      DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
      DROP FUNCTION IF EXISTS update_updated_at_column();
      DROP TABLE IF EXISTS quote_requests CASCADE;
      DROP TABLE IF EXISTS contact_messages CASCADE;
      DROP TABLE IF EXISTS customers CASCADE;
    `);

    // Create customers table
    await client.query(`
      CREATE TABLE customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(50),
        company VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create contact_messages table
    await client.query(`
      CREATE TABLE contact_messages (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(id),
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_customer
          FOREIGN KEY(customer_id) 
          REFERENCES customers(id)
          ON DELETE CASCADE
      )
    `);

    // Create quote_requests table
    await client.query(`
      CREATE TABLE quote_requests (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(id),
        service_type VARCHAR(255),
        project_details TEXT NOT NULL,
        timeline VARCHAR(255),
        budget_range VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_customer
          FOREIGN KEY(customer_id)
          REFERENCES customers(id)
          ON DELETE CASCADE
      )
    `);

    // Create updated_at trigger function
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Create trigger for customers table
    await client.query(`
      CREATE TRIGGER update_customers_updated_at
        BEFORE UPDATE ON customers
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Error running migrations:', error);
    if (error.code === 'ECONNREFUSED') {
      console.error('Could not connect to the database. Please check your DATABASE_URL environment variable.');
    }
    process.exit(1);
  } finally {
    if (client) {
      try {
        await client.release();
        await pool.end();
      } catch (releaseError) {
        console.error('Error releasing client:', releaseError);
      }
    }
  }
}

runMigrations();
