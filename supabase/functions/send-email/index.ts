import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const TO_EMAILS = ['yptgrind@yahoo.com', 'ypgrind@gmail.com']

interface FormData {
  formType: string
  data: {
    name: string
    email: string
    phone?: string
    company?: string
    message?: string
    service_type?: string
    project_details?: string
    timeline?: string
    budget_range?: string
    created_at: string
  }
}

serve(async (req) => {
  try {
    const { formType, data } = await req.json() as FormData

    // Prepare email content based on form type
    let subject: string
    let htmlContent: string

    if (formType === 'contact_messages') {
      subject = `New Contact Form Submission from ${data.name}`
      htmlContent = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
        ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `
    } else if (formType === 'quote_requests') {
      subject = `New Quote Request from ${data.name}`
      htmlContent = `
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
        ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
        <p><strong>Service Type:</strong> ${data.service_type}</p>
        <p><strong>Project Details:</strong></p>
        <p>${data.project_details}</p>
        ${data.timeline ? `<p><strong>Timeline:</strong> ${data.timeline}</p>` : ''}
        ${data.budget_range ? `<p><strong>Budget Range:</strong> ${data.budget_range}</p>` : ''}
      `
    } else {
      throw new Error('Invalid form type')
    }

    // Send email to each recipient
    const emailPromises = TO_EMAILS.map(async (toEmail) => {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Young\'s Precision Tool Grinding <no-reply@yptgrind.com>',
          to: toEmail,
          subject: subject,
          html: htmlContent,
          reply_to: data.email,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message)
      }

      return res.json()
    })

    await Promise.all(emailPromises)

    return new Response(
      JSON.stringify({ message: 'Emails sent successfully' }),
      { headers: { 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
})
