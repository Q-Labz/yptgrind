const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

// CORS headers
const headers = {
  'Access-Control-Allow-Origin': 'https://yptgrind.netlify.app',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

exports.handler = async (event, context) => {
  // Handle OPTIONS request for CORS
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
    const { name, email, phone, company, serviceType, projectDetails, timeline, budgetRange } = JSON.parse(event.body);
    
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

    // First, create or get customer
    const customer = await sql`
      INSERT INTO customers (name, email, phone, company)
      VALUES (${name}, ${email}, ${phone || null}, ${company || null})
      ON CONFLICT (email) DO UPDATE
      SET name = ${name},
          phone = COALESCE(${phone || null}, customers.phone),
          company = COALESCE(${company || null}, customers.company)
      RETURNING id;
    `;

    // Then create the quote request
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true })
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
