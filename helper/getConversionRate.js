const axios = require('axios')
const cheerio = require('cheerio')

async function getConversionRate() {
  const response = await axios.get('https://wise.com/hu/currency-converter/eur-to-huf-rate');
  const $ = cheerio.load(response.data);
  return $('span.text-success').first().text();
}

module.exports = {
  getConversionRate: getConversionRate
}