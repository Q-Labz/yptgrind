# Young's Precision Tool Grinding Website

A modern website for Young's Precision Tool Grinding services, built with React and deployed on Netlify.

## Features

- Responsive pages: Home, About, Services, Store, and Contact
- Contact and quote forms that save to Supabase (with file attachments in Supabase Storage)
- Chat assistant served by a Netlify Function (`functions/chat.js`)

## Setup

1. Install dependencies:
   ```bash
   npm install           # Netlify + Supabase CLIs
   cd client && npm install
   ```
2. Copy `.env.example` and fill in the values:
   - `REACT_APP_SUPABASE_URL` / `REACT_APP_SUPABASE_ANON_KEY` go in `client/.env`
   - `OPENAI_API_KEY` goes in the Netlify site's environment variables (or `.env` for `netlify dev`)
3. Database schema for Supabase lives in `migrations/`.
4. Run locally:
   ```bash
   npm run dev      # netlify dev: React app + functions at /api/*
   npm run client   # React app only
   ```

## Project Structure

```
client/          React frontend (pages are code-split and loaded on demand)
functions/       Netlify Functions, served at /api/<name>
migrations/      Supabase SQL
supabase/        Supabase edge functions
netlify.toml     Build, redirect, and header config
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
