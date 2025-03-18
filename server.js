const express = require('express');
const path = require('path');
const cors = require('cors');
const { neon } = require('@neondatabase/serverless');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5005;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'client/build')));

// Database connection
const sql = neon(process.env.DATABASE_URL);

// Test database connection
const testDbConnection = async () => {
  try {
    await sql`SELECT 1`;
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

testDbConnection();

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// API Routes
app.post('/api/contact', async (req, res) => {
  try {
    console.log('Received contact form submission:', req.body);
    const { name, email, phone, company, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Name, email, and message are required'
      });
    }

    // First, create or get customer
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

    // Then create the contact message
    console.log('Creating contact message...');
    await sql`
      INSERT INTO contact_messages (customer_id, message)
      VALUES (${customer[0].id}, ${message});
    `;
    console.log('Contact message created successfully');

    res.json({ success: true });
  } catch (error) {
    console.error('Contact submission error details:', error);
    res.status(500).json({ 
      error: 'Failed to submit contact form', 
      details: error.message 
    });
  }
});

app.post('/api/quote', async (req, res) => {
  try {
    console.log('Received quote request:', req.body);
    const { name, email, phone, company, serviceType, projectDetails, timeline, budgetRange } = req.body;
    
    // Validate required fields
    if (!name || !email || !serviceType) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Name, email, and service type are required'
      });
    }

    // First, create or get customer
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

    // Then create the quote request
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

    res.json({ success: true });
  } catch (error) {
    console.error('Quote request error:', error);
    res.status(500).json({ 
      error: 'Failed to submit quote request',
      details: error.message
    });
  }
});

// Chatbot endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for Young's Precision Tool Grinding, knowledgeable about tool and cutter grinding services."
        },
        {
          role: "user",
          content: message
        }
      ]
    });
    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Catch all other routes and return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
