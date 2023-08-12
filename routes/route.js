const express = require('express');
const router = express.Router();

const hasznaltauto_scraper = require('../scraper/hasznaltauto'); 
const mobile_scraper = require('../scraper/mobile')
const sum = require('../math/sum')


router.post('/scrape/hasznaltauto', async (req, res) => {
  if (Object.keys(req.body).length === 0) return res.json('No data in request!');
  
  const { make, model, design, startYear, endYear, doorCount } = req.body;
  if(startYear > endYear) return res.json('Starting year is higher than ending year!')
  if(!make || !model) return res.json('No make or no model provided!');

  try {
    const scrapedData = await hasznaltauto_scraper.scrapeAllData(make, model, design, startYear || 1900, endYear || 2023, doorCount);
    res.json(scrapedData);
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).json({ error: 'An error occurred during scraping.' });
  }
});

router.post('/scrape/mobile', async (req, res) => {
  if (Object.keys(req.body).length === 0) return res.json('No data in request!');

  const { make, model, design, startYear, endYear } = req.body;
  if(!make || !model) return res.json('No make or no model provided!');
  if(startYear > endYear) return res.json('Starting year is higher than ending year!')

  try {
    const scrapedData = await mobile_scraper.scrapeAllData(make, model, design, startYear, endYear);
    res.json(scrapedData);
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).json({ error: 'An error occurred during scraping.' });
  }
})

router.post('/yearly-price-summary/hasznaltauto', async(req, res) => {
  if (Object.keys(req.body).length === 0) return res.json('No data in request!');
  
  const { make, model, design, startYear, endYear, doorCount } = req.body;
  if(!make || !model) return res.json('No make or no model provided!');
  if(startYear > endYear) return res.json('Starting year is higher than ending year!')
  try {
    const scrapedData = await hasznaltauto_scraper.scrapeAllData(make, model, design, startYear || 1900, endYear || 2023, doorCount);
    const sumData = sum.getSum(scrapedData)
    res.json(sumData);
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).json({ error: 'An error occurred during scraping.' });
  }
})

router.post('/yearly-price-summary/mobile', async(req, res) => {
  if (Object.keys(req.body).length === 0) return res.json('No data in request!');
  
  const { make, model, design, startYear, endYear } = req.body;
  if(!make || !model) return res.json('No make or no model provided!');
  if(startYear > endYear) return res.json('Starting year is higher than ending year!')
  try {
    const scrapedData = await mobile_scraper.scrapeAllData(make, model, design, startYear, endYear);
    const sumData = sum.getSum(scrapedData)
    res.json(sumData);
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).json({ error: 'An error occurred during scraping.' });
  }
})

module.exports = router;