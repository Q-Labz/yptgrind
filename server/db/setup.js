const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Read database URL from .env file
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function setupDatabase() {
  try {
    // Read the schema file
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    
    // Connect and execute the schema
    const client = await pool.connect();
    try {
      await client.query(schema);
      console.log('Database schema created successfully!');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error setting up database:', err);
  } finally {
    await pool.end();
  }
}

setupDatabase();
