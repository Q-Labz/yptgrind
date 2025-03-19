import { sql } from '@vercel/postgres';

export const handler = async (event, context) => {
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

    // Create or update customer
    const customer = await sql`
      INSERT INTO customers (name, email, phone, company)
      VALUES (${name}, ${email}, ${phone || null}, ${company || null})
      ON CONFLICT (email) DO UPDATE
      SET name = ${name},
          phone = COALESCE(${phone || null}, customers.phone),
          company = COALESCE(${company || null}, customers.company)
      RETURNING id;
    `;

    // Store the contact message
    await sql`
      INSERT INTO contact_messages (customer_id, message)
      VALUES (${customer[0].id}, ${message});
    `;

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
