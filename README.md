# Young's Precision Tool Grinding Website

A modern website for Young's Precision Tool Grinding services, built with React, Node.js, and Neon DB.

## Features

- Modern, responsive design
- Interactive pages: Home, About, Services, Store, and Contact
- AI-powered chatbot for customer support
- Contact form with Neon DB integration
- Online store with product catalog

## Prerequisites

- Node.js (v14 or higher)
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

4. Initialize the database:
   ```sql
   -- Run these queries in your Neon DB console
   CREATE TABLE contacts (
     id SERIAL PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     email VARCHAR(100) NOT NULL,
     phone VARCHAR(20),
     message TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE orders (
     id SERIAL PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     email VARCHAR(100) NOT NULL,
     phone VARCHAR(20),
     address TEXT NOT NULL,
     product_id INTEGER NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

5. Start the development servers:
   ```bash
   # Start both frontend and backend
   npm run dev:full

   # Or start them separately:
   npm run dev      # Backend server
   cd client && npm start  # Frontend server
   ```

## Project Structure

```
youngs-precision/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   └── App.js        # Main app component
├── server.js              # Express backend server
├── .env                   # Environment variables
└── README.md             # Project documentation
```

## Available Scripts

- `npm run dev`: Start the backend server in development mode
- `npm run client`: Start the frontend development server
- `npm run dev:full`: Start both frontend and backend servers
- `npm start`: Start the production server

## Environment Variables

- `PORT`: Server port (default: 5000)
- `DATABASE_URL`: Neon DB connection string
- `OPENAI_API_KEY`: OpenAI API key for the chatbot

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
