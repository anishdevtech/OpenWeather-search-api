const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Read city data from the JSON file
const cityDataPath = path.join(__dirname, 'city.list.min.json');
const cityData = JSON.parse(fs.readFileSync(cityDataPath, 'utf8'));
app.get("/", (req, res) => {
  res.send("Express on Vercel");
});
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
