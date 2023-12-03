const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Read city data from the JSON file
const cityDataPath = path.join(__dirname, 'city.list.min.json');
const cityData = JSON.parse(fs.readFileSync(cityDataPath, 'utf8'));

// OpenWeatherMap API key (replace with your own key)
const apiKey = process.env.api

// API endpoint to get city information by name
app.get('/city/:cityName', (req, res) => {
  const cityName = req.params.cityName.toLowerCase();

  const matchingCity = cityData.find(city => city.name.toLowerCase() === cityName);

  if (matchingCity) {
    res.json(matchingCity);
  } else {
    res.status(404).json({ error: 'City not found' });
  }
});

// API endpoint to get city information by coordinates
app.get('/getCityId', async (req, res) => {
  const { lon, lat } = req.query;

  try {
    // Use OpenWeatherMap Geocoding API to get city name from coordinates
    const geoApiUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
    const geoResponse = await axios.get(geoApiUrl);

    const cityName = geoResponse.data[0]?.name;

    if (cityName) {
      // Search for the city in the local JSON data
      const matchingCity = cityData.find(city => city.name.toLowerCase() === cityName.toLowerCase());

      if (matchingCity) {
        res.json(matchingCity);
      } else {
        res.status(404).json({ error: 'City not found in local data' });
      }
    } else {
      res.status(404).json({ error: 'City not found in OpenWeatherMap data' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
