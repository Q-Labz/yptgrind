const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { name, email, phone, company, message } = JSON.parse(event.body);
    
    // Validate required fields
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          details: 'Name, email, and message are required'
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

    // Then create the contact message
    await sql`
      INSERT INTO contact_messages (customer_id, message)
      VALUES (${customer[0].id}, ${message});
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Contact submission error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to submit contact form',
        details: error.message
      })
    };
  }
};
