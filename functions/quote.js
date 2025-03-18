const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

// Allow both local development and production URLs
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3005',
  'https://yptgrind.netlify.app'
];

exports.handler = async (event, context) => {
  // Get the request origin
  const origin = event.headers.origin || event.headers.Origin || '';
  
  // Set CORS headers based on origin
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0]
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log('Quote request received:', event.body);
    const { name, email, phone, company, serviceType, projectDetails, timeline, budgetRange } = JSON.parse(event.body);
    
    // Validate required fields
    if (!name || !email || !serviceType) {
      console.log('Validation failed:', { name, email, serviceType });
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          details: 'Name, email, and service type are required'
        })
      };
    }

    // Create or update customer
    console.log('Creating/updating customer...');
    const customer = await sql`
      INSERT INTO customers (name, email, phone, company)
      VALUES (${name}, ${email}, ${phone || null}, ${company || null})
      ON CONFLICT (email) DO UPDATE
      SET name = ${name},
          phone = COALESCE(${phone || null}, customers.phone),
          company = COALESCE(${company || null}, customers.company)
      RETURNING id;
    `;
    console.log('Customer created/updated:', customer);

    // Create quote request
    console.log('Creating quote request...');
    await sql`
      INSERT INTO quote_requests (
        customer_id,
        service_type,
        project_details,
        timeline,
        budget_range
      ) VALUES (
        ${customer[0].id},
        ${serviceType},
        ${projectDetails || null},
        ${timeline || null},
        ${budgetRange || null}
      );
    `;
    console.log('Quote request created successfully');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        message: 'Quote request submitted successfully! We\'ll be in touch soon.'
      })
    };
  } catch (error) {
    console.error('Quote request error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to submit quote request',
        details: error.message
      })
    };
  }
};
