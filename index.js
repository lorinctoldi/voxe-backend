const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const { performance } = require('perf_hooks');

// results max 600 ?
axios
  .post('https://www.hasznaltauto.hu/egyszeru/szemelyauto', {
    marka_id: 12,
    modell_id: 120,
    results: 600
  })
  .then(res => {
		const $ = cheerio.load(res.data);
    const listings = [];

    $('div.talalati-sor').each((index, element) => {
      const title = $(element).find('h3 a').text().replace(/\s/g, '')
			const price = $(element).find('div.pricefield-primary').first().text().replace('Ft', '').replace(/\s/g, '')
      const fuel = $(element).find('span.info').eq(0).text().replace(',','').toLowerCase().replace(/\s/g, '')
      const date = $(element).find('span.info').eq(1).text().replace(',','').replace(/\s/g, '')
      const displacement = $(element).find('span.info').eq(2).text().replace(' cm³,','').replace(/\s/g, '')
      const power_output = $(element).find('span.info').eq(3).text().replace(' kW,','').replace(/\s/g, '')
      const horse_power = $(element).find('span.info').eq(4).text().replace(' LE,', '').replace(/\s/g, '')
      const odometer = $(element).find('span.info').eq(5).text().replace(' km', '').replace(/\s/g, '')
			listings.push({
        title: title, 
        price: price, 
        fuel: fuel, 
        date: date, 
        displacement: displacement, 
        power_output: power_output,
        horse_power: horse_power,
        odometer: odometer
      })
    });

		fs.writeFileSync('data.json', JSON.stringify(listings, null, 2))
		console.log('no error, its done')
  })
  .catch((error) => {
    console.log(error.response.data.error);
  });
