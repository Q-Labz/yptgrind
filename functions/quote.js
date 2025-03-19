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
      ).catch(err => {
        console.error('Quote request query error:', err);
        throw new Error(`Failed to store quote request: ${err.message}`);
      });

      console.log('Successfully processed quote request');

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Thank you for your quote request. We will get back to you soon!'
        })
      };
    } finally {
      console.log('Releasing database connection...');
      await client.release();
    }
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
  }
};
