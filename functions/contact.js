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
    console.log('Contact form submission received:', event.body);
    const { name, email, phone, company, message } = JSON.parse(event.body);
    
    // Validate required fields
    if (!name || !email || !message) {
      console.log('Validation failed:', { name, email, message });
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          details: 'Name, email, and message are required'
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

    // Create contact message
    console.log('Creating contact message...');
    await sql`
      INSERT INTO contact_messages (
        customer_id,
        message
      ) VALUES (
        ${customer[0].id},
        ${message}
      );
    `;
    console.log('Contact message created successfully');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        message: 'Message sent successfully! We\'ll get back to you soon.'
      })
    };
  } catch (error) {
    console.error('Contact form error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to send message',
        details: error.message
      })
    };
  }
};
