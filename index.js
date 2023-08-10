const express = require('express');

const scrape = require('./scrape')

const app = express();
app.use(express.json())

app.post('/scrape', async (req, res) => {
  const requestData = req.body
  if(!requestData) return res.json('No data in request!')
  const startYear = requestData.startYear
  const endYear = requestData.endYear
  res.json(await scrape.scrapeAllData(startYear, endYear))
})

app.listen(8000, function (err) {
  if (err) console.log(err);
  console.log("Server listening on", 8000);
})
