-- Create a function to send email notifications
CREATE OR REPLACE FUNCTION public.handle_form_submission()
RETURNS TRIGGER AS $$
BEGIN
  -- Make HTTP request to our edge function
  SELECT
    net.http_post(
      url := 'https://xskkklskqxfrrzbffeew.supabase.co/functions/v1/send-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhza2trbHNrcXhmcnJ6YmZmZWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMDYwNjQsImV4cCI6MjA1ODg4MjA2NH0.A5rnaIoQzJHRW7tsH03rbfAxV4XbAFvUvoJTnNBNydA'
      ),
      body := jsonb_build_object(
        'formType', TG_TABLE_NAME,
        'data', row_to_json(NEW)
      )
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Enable the pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create triggers for both tables
DROP TRIGGER IF EXISTS contact_messages_email_trigger ON public.contact_messages;
CREATE TRIGGER contact_messages_email_trigger
  AFTER INSERT ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_form_submission();

DROP TRIGGER IF EXISTS quote_requests_email_trigger ON public.quote_requests;
CREATE TRIGGER quote_requests_email_trigger
  AFTER INSERT ON public.quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_form_submission();
