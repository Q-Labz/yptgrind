// Chat assistant endpoint, reached from the site at /api/chat.
// Needs OPENAI_API_KEY set in the Netlify site's environment variables.

const SYSTEM_PROMPT =
  "You are a helpful assistant for Young's Precision Tool Grinding in Ontario, CA, " +
  'knowledgeable about tool and cutter grinding services. Keep answers short. ' +
  'For quotes or anything you are unsure of, point people to (951) 368-8731 or yptgrind@yahoo.com.';

const MAX_MESSAGE_LENGTH = 1000;
const TIMEOUT_MS = 15000;

const headers = { 'Content-Type': 'application/json' };

const reply = (statusCode, body) => ({ statusCode, headers, body: JSON.stringify(body) });

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return reply(405, { error: 'Method not allowed' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return reply(503, { error: 'Chat is not configured' });
  }

  let message;
  try {
    ({ message } = JSON.parse(event.body || '{}'));
  } catch {
    return reply(400, { error: 'Request body must be valid JSON' });
  }

  if (typeof message !== 'string' || !message.trim()) {
    return reply(400, { error: 'Message is required' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        max_tokens: 400,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message.trim().slice(0, MAX_MESSAGE_LENGTH) },
        ],
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      console.error('OpenAI request failed:', response.status, await response.text());
      return reply(502, { error: 'Chat service unavailable' });
    }

    const data = await response.json();
    return reply(200, { response: data.choices[0].message.content });
  } catch (error) {
    console.error('Chat error:', error.message);
    return reply(502, { error: 'Chat service unavailable' });
  }
};
