const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://xskkklskqxfrrzbffeew.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhza2trbHNrcXhmcnJ6YmZmZWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMDYwNjQsImV4cCI6MjA1ODg4MjA2NH0.A5rnaIoQzJHRW7tsH03rbfAxV4XbAFvUvoJTnNBNydA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  try {
    // Create contact_messages table
    const { error: contactError } = await supabase.from('contact_messages').insert({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message'
    }).select();

    if (contactError && !contactError.message.includes('already exists')) {
      console.error('Error creating contact_messages table:', contactError);
      return;
    }

    // Create quote_requests table
    const { error: quoteError } = await supabase.from('quote_requests').insert({
      name: 'Test User',
      email: 'test@example.com',
      service_type: 'Test',
      project_details: 'Test details'
    }).select();

    if (quoteError && !quoteError.message.includes('already exists')) {
      console.error('Error creating quote_requests table:', quoteError);
      return;
    }

    console.log('Tables verified successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createTables();
