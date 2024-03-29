const axios = require('axios');
const cheerio = require('cheerio');
const filterSuspicious = require('../helper/filter')

const fuel = require('../helper/getFuelType')
const conversion = require('../helper/getConversionRate')

const headers = {
  'Pragma': 'no-cache',
  'Cache-Control': 'no-cache',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/6.1 (Macintosh; ARM Mac OS X 12_12_3) AppleWebKit/737.36 (KHTML, like Gecko) Chrome/62.0.2821.0 Safari/737.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate, sdch',
  'Accept-Language': 'de;q=0.8,en;q=0.6',
};

async function scrapeDataByPage(make, model, startYear, endYear, pageNum) {
  console.log('Currently scraping cars from page number ', pageNum)
  const conversionRate = await conversion.getConversionRate();
  const array = [];
  const url = `https://mobile.de/consumer/api/search/srp/items?page=${pageNum}&url=%2Fauto%2Fsearch.html%3Fdam%3D0%26${(startYear || endYear) ? `fr%3D${(startYear || 1900)}%253A${(endYear || 2023)}%26` : ''}ms%3D${make || 1900}%253B${model || 22}%253B%253B%26od%3Dup%26s%3DCar%26sb%3Dp%26vc%3DCar%26ref%3DsrpHead`;
  const res = await axios.get(url, headers);

  res.data.items.filter(item => item.title).forEach(item => {
    let attributes = item.attributes
    let odometerMatch = attributes.match(/\d+\s*km/);
    let yearMonthMatch = attributes.match(/(\d{2})\/(\d{4})/);
    let horsepowerMatch = attributes.match(/\d+\s*PS/);

    const formatted = {
      label: item.title,
      price: parseInt(Math.round(item.price.grossAmount * conversionRate)),
      fuel: fuel.getFuelType(attributes.toLowerCase()),
      year: parseInt(yearMonthMatch[2] || null),
      month: parseInt(yearMonthMatch[1] || null),
      horse_power: horsepowerMatch ? parseInt(horsepowerMatch[0].match(/\d+/)[0]) : null,
      odometer: parseInt(odometerMatch[0] || null),
      image: item.previewImage?.src,
      link: `https://suchen.mobile.de${item.relativePath}`
    };
    array.push(formatted);
  });

  if(pageNum === 1) array.shift();
  return {
    items: array,
    hasNextPage: res.data.hasNextPage && res.data.items.length > 1
  };
}

async function scrapeAllData(make, model, startYear, endYear) {
  console.log('Scraping mobile')
  let pageNum = 1;
  let allListings = [];
  let hasNextPage = true;

  while (hasNextPage) {
    const { items, hasNextPage: nextPage } = await scrapeDataByPage(make, model, startYear, endYear, pageNum);
    allListings = allListings.concat(items);
    hasNextPage = nextPage;
    pageNum++;
  }

  return filterSuspicious.filter(allListings);
}

module.exports = {
  scrapeAllData: scrapeAllData
}