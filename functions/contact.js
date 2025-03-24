const { Pool } = require('pg');

// Log environment variables (excluding sensitive data)
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  hasDbUrl: !!process.env.DATABASE_URL,
  dbUrlLength: process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

exports.handler = async (event, context) => {
  // Set CORS headers for development
  const headers = {
    'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development' ? 'http://localhost:3004' : 'https://yptgrind.netlify.app',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
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
    console.log('Request headers:', event.headers);

    let body;
    try {
      body = JSON.parse(event.body);
      console.log('Parsed request body:', body);
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      console.log('Raw request body:', event.body);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Invalid request format',
          details: 'Request body must be valid JSON'
        })
      };
    }

    const { name, email, phone, company, message } = body;

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      console.log('Missing required fields:', { name, email, message });
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing required fields',
          details: 'Name, email, and message are required'
        })
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      console.log('Invalid email format:', email);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Invalid email format',
          details: 'Please provide a valid email address'
        })
      };
    }

    console.log('Attempting to connect to database...');
    try {
      client = await pool.connect();
      console.log('Successfully connected to database');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      console.error('Database connection error stack:', dbError.stack);
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({
          error: 'Database connection error',
          details: 'Unable to connect to the database. Please try again later.'
        })
      };
    }

    // Begin transaction
    await client.query('BEGIN');

    console.log('Creating/updating customer...');
    // Create or update customer
    const customerResult = await client.query(
      `INSERT INTO customers (name, email, phone, company)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE
      SET name = EXCLUDED.name,
          phone = COALESCE(EXCLUDED.phone, customers.phone),
          company = COALESCE(EXCLUDED.company, customers.company),
          updated_at = CURRENT_TIMESTAMP
      RETURNING id`,
      [name.trim(), email.trim(), phone?.trim() || null, company?.trim() || null]
    );

    if (!customerResult.rows[0]) {
      throw new Error('Failed to create or update customer');
    }

    console.log('Customer created/updated, storing contact message...');
    // Store the contact message
    await client.query(
      `INSERT INTO contact_messages (customer_id, message)
      VALUES ($1, $2)`,
      [customerResult.rows[0].id, message.trim()]
    );

    // Commit transaction
    await client.query('COMMIT');

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

    // Rollback transaction if client exists
    if (client) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        console.error('Error rolling back transaction:', rollbackError);
      }
    }

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

    // Check if it's a database constraint violation
    if (error.code === '23505') { // Unique violation
      return {
        statusCode: 409,
        headers,
        body: JSON.stringify({
          error: 'Duplicate entry',
          details: 'This email address is already registered'
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
