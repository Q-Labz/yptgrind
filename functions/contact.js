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

  try {
    console.log('Received contact form submission');
    const { name, email, phone, company, message } = JSON.parse(event.body);

    // Validate required fields
    if (!name || !email || !message) {
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
    const client = await db.connect().catch(err => {
      console.error('Database connection error:', err);
      throw new Error(`Failed to connect to database: ${err.message}`);
    });

    try {
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
      ).catch(err => {
        console.error('Customer query error:', err);
        throw new Error(`Failed to create/update customer: ${err.message}`);
      });

      console.log('Customer created/updated, storing contact message...');
      // Store the contact message
      await client.query(
        `INSERT INTO contact_messages (customer_id, message)
        VALUES ($1, $2)`,
        [customerResult.rows[0].id, message]
      ).catch(err => {
        console.error('Contact message query error:', err);
        throw new Error(`Failed to store contact message: ${err.message}`);
      });

      console.log('Successfully processed contact form submission');

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Thank you for your message. We will get back to you soon!'
        })
      };
    } finally {
      console.log('Releasing database connection...');
      await client.release();
    }
  } catch (error) {
    console.error('Error processing contact form:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error.message
      })
    };
  }
};
