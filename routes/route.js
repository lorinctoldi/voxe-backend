const express = require('express');
const router = express.Router();

const hasznaltauto_scraper = require('../scraper/hasznaltauto'); 
const mobile_scraper = require('../scraper/mobile')
const sum = require('../math/sum')
const score = require('../deals/crossScore')


router.post('/scrape/hasznaltauto', async (req, res) => {
  if (Object.keys(req.body).length === 0) return res.json('No data in request!');
  
  const { make, model, design, startYear, endYear, doorCount } = req.body;
  if(startYear > endYear) return res.json('Starting year is higher than ending year!')
  if(!make || !model) return res.json('No make or no model provided!');
  console.log('A kérelem működik')

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

router.post('/yearly-summary/hasznaltauto', async(req, res) => {
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

router.post('/yearly-summary/mobile', async(req, res) => {
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

router.post('/reverse-score', async(req, res) => {
  if (Object.keys(req.body).length === 0) return res.json('No data in request!');
  const { mobileMake, mobileModel, hasznaltautoMake, hasznaltautoModel, startYear, endYear} = req.body

  if(!mobileMake || !mobileModel || !hasznaltautoMake || !hasznaltautoMake) return res.json('No make or no model provided!');
  if(startYear > endYear) return res.json('Starting year is higher than ending year!')

  try {
    const data = await score.getScoredItems(mobileMake, mobileModel, hasznaltautoMake, hasznaltautoModel, startYear, endYear)
    res.json(data)
  } catch (error) {
    console.error('Error during process:', error)
    res.status(500).json({ error: 'An error occurred during process.' });
  }
})

module.exports = router;