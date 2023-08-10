// scrape.js

const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeDataForYearRange(evjarat_min, evjarat_max) {
  try {
    const response = await axios.post('https://www.hasznaltauto.hu/egyszeru/szemelyauto', {
      marka_id: 12,
      modell_id: 102,
      results: 600,
      evjarat_min: evjarat_min,
      evjarat_max: evjarat_max
    });

    const $ = cheerio.load(response.data);
    const listings = [];

    $('div.talalati-sor').each((index, element) => {
      const title = $(element).find('h3 a').text();
      const price = $(element).find('div.pricefield-primary').first().text().replace('Ft', '').replace(/\s/g, '');
      const fuel = $(element).find('span.info').eq(0).text().replace(',','').toLowerCase().replace(/\s/g, '');
      const date = $(element).find('span.info').eq(1).text().replace(',','').replace(/\s/g, '');
      const displacement = $(element).find('span.info').eq(2).text().replace('cm³,','').replace(/\s/g, '');
      const power_output = $(element).find('span.info').eq(3).text().replace('kW,','').replace(/\s/g, '');
      const horse_power = $(element).find('span.info').eq(4).text().replace('LE,','').replace(/\s/g, '');
      const odometer = $(element).find('span.info').eq(5).text().replace('km','').replace(/\s/g, '');
      const link = $(element).find('a').eq(1).attr('href')
      const imageSmall = $(element).find('img').first().attr('src')
      const image = imageSmall.replace('t.jpg', '.jpg')

      listings.push({
        title: title,
        price: price,
        fuel: fuel,
        date: date,
        displacement: displacement,
        power_output: power_output,
        horse_power: horse_power,
        odometer: odometer,
        link: link,
        image_small: imageSmall,
        image: image
      });
    });

    return listings;
  } catch (error) {
    console.error('Error scraping data:', error);
    return [];
  }
}

async function scrapeAllData(startYear, endYear) {
  const allListings = [];

  for (let year = startYear; year <= endYear; year++) {
    const listings = await scrapeDataForYearRange(year, year + 1);
    allListings.push(...listings);
  }

  return allListings;
}

module.exports = {
  scrapeAllData: scrapeAllData
};
