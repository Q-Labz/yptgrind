# Young's Precision Tool Grinding Website

A modern website for Young's Precision Tool Grinding services, built with React, Node.js, and Neon DB.

**TGX Studio** (cutting tool designer + traveler + ToolRoom handoff) lives at `/studio/` and is built from the `studio/` Vite app into `client/build/studio` during `npm run build:netlify`.

## Features

- Modern, responsive design
- Interactive pages: Home, About, Services, Store, Contact, and TGX Studio
- AI-powered chatbot for customer support
- Contact form with Neon DB integration
- Online store with product catalog

## Prerequisites

- Node.js (v20 or higher for the Netlify / TGX Studio build)
- npm (v6 or higher)
- Neon DB account
- OpenAI API key

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install        # Install backend dependencies
   cd client
   npm install       # Install frontend dependencies
   cd ..
   ```

3. Configure environment variables:
   - Rename `.env.example` to `.env`
   - Add your Neon DB connection string
   - Add your OpenAI API key

4. Start the development servers:
   ```bash
   npm run dev:full
   ```

TGX Studio (standalone Vite app):

```bash
cd studio
npm install
npm run dev
```

Production URL after deploy: **https://yptgrind.com/studio/**
