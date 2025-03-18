const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Submit a quote request
router.post('/quote', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // First, create or update customer
    const customerResult = await client.query(
      `INSERT INTO customers (name, email, phone, company)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE
       SET name = $1, phone = $3, company = $4
       RETURNING id`,
      [req.body.name, req.body.email, req.body.phone, req.body.company]
    );

    const customerId = customerResult.rows[0].id;

    // Then, create quote request
    await client.query(
      `INSERT INTO quote_requests (customer_id, service_type, project_details, timeline, budget_range)
       VALUES ($1, $2, $3, $4, $5)`,
      [customerId, req.body.serviceType, req.body.projectDetails, req.body.timeline, req.body.budgetRange]
    );

    await client.query('COMMIT');
    res.status(201).json({ message: 'Quote request submitted successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error submitting quote:', err);
    res.status(500).json({ error: 'Failed to submit quote request' });
  } finally {
    client.release();
  }
});

// Submit a contact form message
router.post('/contact', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // First, create or update customer
    const customerResult = await client.query(
      `INSERT INTO customers (name, email, phone, company)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE
       SET name = $1, phone = $3, company = $4
       RETURNING id`,
      [req.body.name, req.body.email, req.body.phone, req.body.company]
    );

    const customerId = customerResult.rows[0].id;

    // Then, create contact message
    await client.query(
      `INSERT INTO contact_messages (customer_id, subject, message)
       VALUES ($1, $2, $3)`,
      [customerId, req.body.subject, req.body.message]
    );

    await client.query('COMMIT');
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Failed to send message' });
  } finally {
    client.release();
  }
});

module.exports = router;
