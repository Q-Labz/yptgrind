const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

// CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*', // Allow both local and production
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

exports.handler = async (event, context) => {
  console.log('Contact form submission received:', event.body); // Add logging

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
    const { name, email, phone, company, message } = JSON.parse(event.body);
    
    console.log('Parsed data:', { name, email }); // Log parsed data

    // Validate required fields
    if (!name || !email || !message) {
      console.log('Validation failed:', { name, email, message }); // Log validation failure
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          details: 'Name, email, and message are required'
        })
      };
    }

    // First, create or get customer
    console.log('Creating/updating customer...'); // Log database operation
    const customer = await sql`
      INSERT INTO customers (name, email, phone, company)
      VALUES (${name}, ${email}, ${phone || null}, ${company || null})
      ON CONFLICT (email) DO UPDATE
      SET name = ${name},
          phone = COALESCE(${phone || null}, customers.phone),
          company = COALESCE(${company || null}, customers.company)
      RETURNING id;
    `;
    console.log('Customer created/updated:', customer); // Log result

    // Then create the contact message
    console.log('Creating contact message...'); // Log database operation
    await sql`
      INSERT INTO contact_messages (customer_id, message)
      VALUES (${customer[0].id}, ${message});
    `;
    console.log('Contact message created successfully'); // Log success

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        message: 'Message sent successfully'
      })
    };
  } catch (error) {
    console.error('Contact submission error:', error); // Log error details
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to submit contact form',
        details: error.message
      })
    };
  }
};
