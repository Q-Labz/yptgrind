-- Enable Storage for file uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('form-attachments', 'form-attachments', true);

-- Update contact_messages table
ALTER TABLE public.contact_messages
ADD COLUMN IF NOT EXISTS subject text,
ADD COLUMN IF NOT EXISTS preferred_contact text,
ADD COLUMN IF NOT EXISTS best_time text,
ADD COLUMN IF NOT EXISTS urgency text,
ADD COLUMN IF NOT EXISTS industry text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS how_found text,
ADD COLUMN IF NOT EXISTS attachment_urls text[];

-- Update quote_requests table
ALTER TABLE public.quote_requests
ADD COLUMN IF NOT EXISTS material text,
ADD COLUMN IF NOT EXISTS quantity integer,
ADD COLUMN IF NOT EXISTS dimensions text,
ADD COLUMN IF NOT EXISTS surface_finish text,
ADD COLUMN IF NOT EXISTS tolerances text,
ADD COLUMN IF NOT EXISTS special_requirements text,
ADD COLUMN IF NOT EXISTS certification_requirements text[],
ADD COLUMN IF NOT EXISTS previous_supplier text,
ADD COLUMN IF NOT EXISTS target_price_range text,
ADD COLUMN IF NOT EXISTS delivery_location text,
ADD COLUMN IF NOT EXISTS preferred_shipping_method text,
ADD COLUMN IF NOT EXISTS quality_requirements text,
ADD COLUMN IF NOT EXISTS inspection_requirements text,
ADD COLUMN IF NOT EXISTS sample_required boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS prototype_required boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS attachment_urls text[];

-- Create policy to allow file uploads
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT TO anon
WITH CHECK (bucket_id = 'form-attachments');

-- Create policy to allow public file downloads
CREATE POLICY "Allow public downloads"
ON storage.objects FOR SELECT TO anon
USING (bucket_id = 'form-attachments');
