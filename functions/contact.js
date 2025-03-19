const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

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
    console.log('Received contact form submission');
    const { name, email, phone, company, message } = JSON.parse(event.body);
    console.log('Form data:', { name, email, phone, company, message });

    // Validate required fields
    if (!name || !email || !message) {
      console.log('Missing required fields');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing required fields',
          details: 'Name, email, and message are required'
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

    if (!customerResult.rows[0]) {
      throw new Error('Failed to create or update customer');
    }

    console.log('Customer created/updated, storing contact message...');
    // Store the contact message
    await client.query(
      `INSERT INTO contact_messages (customer_id, message)
      VALUES ($1, $2)`,
      [customerResult.rows[0].id, message]
    );

    console.log('Successfully processed contact form submission');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Thank you for your message. We will get back to you soon!'
      })
    };

  } catch (error) {
    console.error('Error processing contact form:', error);
    console.error('Error stack:', error.stack);

    // Check if it's a database connection error
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({
          error: 'Database connection error',
          details: 'Unable to connect to the database. Please try again later.'
        })
      };
    }

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
      try {
        await client.release();
      } catch (releaseError) {
        console.error('Error releasing client:', releaseError);
      }
    }
  }
};
