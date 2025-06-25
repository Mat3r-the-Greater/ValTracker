require('dotenv').config();
const express = require('express');
const cors = require('cors');
// Using built-in fetch (Node.js 18+)

const app = express();
const PORT = 3001;

// Load API key from environment variable
const RIOT_API_KEY = process.env.RIOT_API_KEY || (() => {
  console.error('ERROR: RIOT_API_KEY environment variable not set');
  console.error('Please set it with: set RIOT_API_KEY=your-api-key (Windows) or export RIOT_API_KEY=your-api-key (Mac/Linux)');
  process.exit(1);
})();
const RIOT_BASE_URL = 'https://americas.api.riotgames.com';

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Proxy route for Riot API
app.get('/api/*', async (req, res) => {
  try {
    // Remove '/api' from the path and construct the full Riot API URL
    const riotPath = req.path.replace('/api', '');
    const riotUrl = `${RIOT_BASE_URL}${riotPath}`;

    console.log(`Proxying request to: ${riotUrl}`);

    // Make the request to Riot API with proper headers
    const response = await fetch(riotUrl, {
      method: req.method,
      headers: {
        'X-Riot-Token': RIOT_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Riot API Error:', response.status, data);
      return res.status(response.status).json(data);
    }

    console.log('Success:', response.status);
    res.json(data);

  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: 'Proxy server error', details: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Valorant API Proxy is running' });
});

app.listen(PORT, () => {
  console.log(`Valorant API Proxy server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/riot/account/v1/accounts/by-riot-id/Mat3r/t0w`);
});

module.exports = app;
