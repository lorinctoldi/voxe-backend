const express = require('express');
const scrape = require('./scrape');
const timeout = require('connect-timeout');

const app = express();
app.use(express.json());
app.use(timeout('300000')); 

app.post('/scrape', async (req, res) => {
  if (Object.keys(req.body).length === 0) return res.json('No data in request!');
  
  const { brandId, modellId, design, startYear, endYear, doorCount, } = req.body;
  console.log(endYear)
  if(!brandId) return res.json('Nincs márka')
  try {
    const scrapedData = await scrape.scrapeAllData(brandId, modellId, design, startYear || 1900, endYear || 2023, doorCount);
    res.json(scrapedData);
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).json({ error: 'An error occurred during scraping.' });
  }
});


app.listen(8000, function (err) {
  if (err) console.log(err);
  console.log('Server listening on', 8000);
});