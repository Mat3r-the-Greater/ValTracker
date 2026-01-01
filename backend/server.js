// backend/server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for your Angular app
app.use(cors({
  origin: 'http://localhost:4200'
}));

app.use(express.json());

// Henrik API configuration
const HENRIK_API_KEY = process.env.HENRIK_API_KEY;
const HENRIK_BASE_URL = 'https://api.henrikdev.xyz/valorant';

// Helper function to get Henrik headers
const getHenrikHeaders = () => ({
  'Authorization': HENRIK_API_KEY
});

// Proxy for account lookup
app.get('/api/henrik/account/:name/:tag', async (req, res) => {
  try {
    const { name, tag } = req.params;
    console.log(`Fetching account for ${name}#${tag}`);

    const response = await axios.get(
      `${HENRIK_BASE_URL}/v2/account/${name}/${tag}`,
      { headers: getHenrikHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Account error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Error fetching account data'
    });
  }
});

// Proxy for MMR data
app.get('/api/henrik/mmr/:region/:name/:tag', async (req, res) => {
  try {
    const { region, name, tag } = req.params;
    console.log(`Fetching MMR for ${name}#${tag} in ${region}`);

    const response = await axios.get(
      `${HENRIK_BASE_URL}/v2/mmr/${region}/${name}/${tag}`,
      { headers: getHenrikHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    console.error('MMR error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Error fetching MMR data'
    });
  }
});

// Proxy for match history
app.get('/api/henrik/matches/:region/:name/:tag', async (req, res) => {
  try {
    const { region, name, tag } = req.params;
    const { filter } = req.query;

    console.log(`Fetching matches for ${name}#${tag} in ${region}${filter ? ` (filter: ${filter})` : ''}`);

    let url = `${HENRIK_BASE_URL}/v3/matches/${region}/${name}/${tag}`;
    if (filter) {
      url += `?filter=${filter}`;
    }

    const response = await axios.get(url, {
      headers: getHenrikHeaders()
    });
    res.json(response.data);
  } catch (error) {
    console.error('Match history error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Error fetching match history'
    });
  }
});

// Proxy for match details
app.get('/api/henrik/match/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;
    console.log(`Fetching match details for ${matchId}`);

    const response = await axios.get(
      `${HENRIK_BASE_URL}/v2/match/${matchId}`,
      { headers: getHenrikHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Match details error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Error fetching match details'
    });
  }
});

// Proxy for leaderboard
app.get('/api/henrik/leaderboard/:region', async (req, res) => {
  try {
    const { region } = req.params;
    const { season } = req.query;

    let url = `${HENRIK_BASE_URL}/v2/leaderboard/${region}`;
    if (season) {
      url += `?season=${season}`;
    }

    const response = await axios.get(url, {
      headers: getHenrikHeaders()
    });
    res.json(response.data);
  } catch (error) {
    console.error('Leaderboard error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Error fetching leaderboard'
    });
  }
});

// Proxy for store offers
app.get('/api/henrik/store-offers', async (req, res) => {
  try {
    const response = await axios.get(
      `${HENRIK_BASE_URL}/v1/store-offers`,
      { headers: getHenrikHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Store offers error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Error fetching store offers'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    apiKeyConfigured: !!HENRIK_API_KEY
  });
});

app.listen(PORT, () => {
  console.log(`\n✅ Proxy server running on http://localhost:${PORT}`);
  console.log(`🔑 Henrik API Key: ${HENRIK_API_KEY ? 'Configured' : '❌ NOT CONFIGURED'}`);
  console.log(`🌐 CORS enabled for: http://localhost:4200\n`);
});
