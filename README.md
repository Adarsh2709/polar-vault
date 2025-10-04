# Polar Vault - Survey Form

A Node.js backend application for handling survey form submissions with MongoDB integration.

## Features

- Express.js server with EJS templating
- MongoDB database integration with Mongoose
- Survey form submission API
- CORS enabled for cross-origin requests
- Environment variable configuration
- Vercel deployment ready

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Template Engine**: EJS
- **Deployment**: Vercel
- **Environment**: dotenv for configuration

## Project Structure

```
PolarVault/
├── Database/
│   ├── db.js          # Database connection
│   └── survey.js      # Survey model
├── views/
│   └── index.ejs      # Main template
├── assets/            # Static assets
├── server.js          # Main server file
├── package.json       # Dependencies
├── vercel.json        # Vercel configuration
└── .env               # Environment variables
```

## API Endpoints

- `GET /` - Serves the main survey form
- `POST /api/survey` - Submits survey data

## Environment Variables

Create a `.env` file with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env` file

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Visit `http://localhost:3000`

## Deployment

This project is configured for Vercel deployment:

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

## Survey Form Fields

- Name (required)
- Phone (required)
- Use Case (required): picnic, commute, trek
- Capacity (required): 1l, 2l, 3l
- Email (optional)
- Feedback (optional)

## License

MIT
