const axios = require('axios');
const cheerio = require('cheerio');

const fuel = require('../helper/getFuelType')
const conversion = require('../helper/getConversionRate')

async function scrapeDataByPage(make, model, startYear, endYear, pageNum) {
  const conversionRate = await conversion.getConversionRate();
  const array = [];
  const url = `https://mobile.de/consumer/api/search/srp/items?page=${pageNum}&url=%2Fauto%2Fsearch.html%3Fdam%3D0%26${startYear && endYear ? `fr%3D${startYear}%253A${endYear}%26` : ''}ms%3D${make || 1900}%253B${model || 22}%253B%253B%26od%3Dup%26s%3DCar%26sb%3Dp%26vc%3DCar%26ref%3DsrpHead`;
  const res = await axios.get(url);

  res.data.items.filter(item => item.title).forEach(item => {
    let attributes = item.attributes[0].split(' • ')
    let year = null;
    let month = null;
    if(attributes[0] === '<b>Tageszulassung</b>') attributes.shift()
    if(attributes[0] === '<b>Neuwagen</b>') {
      [year, month] = [new Date().getFullYear(), new Date().getMonth()]
    }
    else [month, year] = attributes[0].slice(3,10).split('/')

    let odometer = null
    if(attributes[1].includes('km')) odometer = parseFloat(attributes[1].replace('km', '').replaceAll('.',''))
    let power_output = null;
    let horse_power = null

    if(attributes.join('').includes('kW')) {
      const splitted = attributes.at(-1).split('kW')
      power_output = parseInt(splitted[0])
      horse_power = parseInt(splitted[1].replace(/[^0-9.]/g, ''))
    }

    const formatted = {
      label: item.title,
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

async function scrapeAllData(make, model, startYear, endYear) {
  let pageNum = 1;
  let allListings = [];
  let hasNextPage = true;

  while (hasNextPage) {
    const { items, hasNextPage: nextPage } = await scrapeDataByPage(make, model, startYear, endYear, pageNum);
    allListings = allListings.concat(items);
    hasNextPage = nextPage;
    pageNum++;
  }

  return allListings;
}

module.exports = {
  scrapeAllData: scrapeAllData
}