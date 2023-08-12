const axios = require('axios');
const cheerio = require('cheerio');

const fuel = require('../helper/getFuelType')

async function getConversionRate() {
  const response = await axios.get('https://wise.com/hu/currency-converter/eur-to-huf-rate');
  const $ = cheerio.load(response.data);
  return $('span.text-success').first().text();
}

async function scrapeDataByPage(brandId, modelId, startYear, endYear, pageNum) {
  console.log('Current page scraped is: ', pageNum)
  const conversionRate = await getConversionRate();
  const array = [];
  const url = `https://mobile.de/consumer/api/search/srp/items?page=${pageNum}&url=%2Fauto%2Fsearch.html%3Fdam%3D0%26${startYear && endYear ? `fr%3D${startYear}%253A${endYear}%26` : ''}ms%3D${brandId || 1900}%253B${modelId || 22}%253B%253B%26od%3Dup%26s%3DCar%26sb%3Dp%26vc%3DCar%26ref%3DsrpHead`;
  const res = await axios.get(url);

  res.data.items.filter(item => item.title).forEach(item => {
    const attributes = item.attributes[0].split(' • ').filter(o => o[0] !== '<')
    const [month, year] = attributes[0].slice(3,10).split('/')
    const odometer = parseFloat(attributes[1].replace('km', '').replaceAll('.',''))
    let power_output = undefined;
    let horse_power = undefined

    if(attributes.length > 2) {
      const splitted = attributes[2].split('kW')
      power_output = parseInt(splitted[0])
      horse_power = parseInt(splitted[1].replace(/[^0-9.]/g, ''))
    }

    const formatted = {
      title: item.title,
      price: parseInt(Math.round(item.price.grossAmount * conversionRate)),
      fuel: fuel.getFuelType(item.attributes[1].toLowerCase()),
      year: parseInt(year),
      month: parseInt(month),
      power_output: power_output,
      horse_power: horse_power,
      odometer: parseInt(odometer),
      image: item.previewImage?.src,
      link: `https://suchen.mobile.de${item.relativePath}`
    };
    array.push(formatted);
  });

  if(pageNum === 1) array.shift();
  return {
    items: array,
    hasNextPage: res.data.hasNextPage
  };
}

async function scrapeAllData(brandId, modelId, startYear, endYear) {
  let pageNum = 1;
  let allListings = [];
  let hasNextPage = true;

  while (hasNextPage) {
    const { items, hasNextPage: nextPage } = await scrapeDataByPage(brandId, modelId, startYear, endYear, pageNum);
    allListings = allListings.concat(items);
    hasNextPage = nextPage;
    pageNum++;
  }

  console.log(allListings[0]);
  console.log(allListings.length)
  return allListings;
}