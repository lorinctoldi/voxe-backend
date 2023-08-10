const express = require('express');
const timeout = require('connect-timeout');
require('dotenv').config();

const scrape = require('./scrape'); 
const sum = require('./math/sum')

const app = express();
app.use(express.json());
app.use(timeout('300000')); 

app.post('/scrape', async (req, res) => {
  if (Object.keys(req.body).length === 0) return res.json('No data in request!');
  
  const { brandId, modellId, design, startYear, endYear, doorCount, } = req.body;
  try {
    const scrapedData = await scrape.scrapeAllData(brandId, modellId, design, startYear || 1900, endYear || 2023, doorCount);
    res.json(scrapedData);
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).json({ error: 'An error occurred during scraping.' });
  }
});

app.post('/sum', async(req, res) => {
  if (Object.keys(req.body).length === 0) return res.json('No data in request!');
  
  const { brandId, modellId, design, startYear, endYear, doorCount, } = req.body;
  try {
    const scrapedData = await scrape.scrapeAllData(brandId, modellId, design, startYear || 1900, endYear || 2023, doorCount);
    const sumData = await sum.getSum(scrapedData)
    res.json(sumData);
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).json({ error: 'An error occurred during scraping.' });
  }
})


const port = process.env.PORT
app.listen(port, function (err) {
  if (err) console.log(err);
  console.log('Server listening on', port);
});