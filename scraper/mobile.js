const axios = require('axios');
const cheerio = require('cheerio');
const filterSuspicious = require('../helper/filter')

const fuel = require('../helper/getFuelType')
const conversion = require('../helper/getConversionRate')

const headers = {
  'Authority': 'www.mobile.de',
  'Method': 'GET',
  'Path': '/consumer/api/search/srp/items?page=1&url=%2Fauto%2Fsearch.html%3Fdam%3D0%26fr%3D2021%253A2023%26ms%3D22%253B27227%253B%253B%26od%3Dup%26s%3DCar%26sb%',
  'Scheme': 'https',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8,hu;q=0.7',
  'Cache-Control': 'no-cache',
  'Sec-Ch-Ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
  'Sec-Ch-Ua-Mobile': '?1',
  'Sec-Ch-Ua-Platform': '"Android"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36',
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