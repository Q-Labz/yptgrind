const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const { db } = require('@vercel/postgres');

exports.handler = async (event, context) => {
  // Set CORS headers for development
  const headers = {
    'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://yptgrind.netlify.app',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  let client;
  try {
    console.log('Received quote request submission');
    const { 
      name, 
      email, 
      phone, 
      company, 
      serviceType,
      projectDetails,
      timeline,
      budgetRange
    } = JSON.parse(event.body);

    // Validate required fields
    if (!name || !email || !serviceType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing required fields',
          details: 'Name, email, and service type are required'
        })
      };
    }

    console.log('Attempting to connect to database...');
    client = await pool.connect();

    console.log('Connected to database, creating/updating customer...');
    // Create or update customer
    const customerResult = await client.query(
      `INSERT INTO customers (name, email, phone, company)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE
      SET name = $1,
          phone = COALESCE($3, customers.phone),
          company = COALESCE($4, customers.company)
      RETURNING id`,
      [name, email, phone || null, company || null]
    );

    console.log('Customer created/updated, storing quote request...');
    // Store the quote request
    await client.query(
      `INSERT INTO quote_requests (
        customer_id,
        service_type,
        project_details,
        timeline,
        budget_range
      ) VALUES ($1, $2, $3, $4, $5)`,
      [
        customerResult.rows[0].id,
        serviceType,
        projectDetails || null,
        timeline || null,
        budgetRange || null
      ]
    );

    console.log('Successfully processed quote request');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Thank you for your quote request. We will get back to you soon!'
      })
    };

  } catch (error) {
    console.error('Error processing quote request:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error.message
      })
    };
  } finally {
    if (client) {
      console.log('Releasing database connection...');
      client.release();
    }
  }
};
