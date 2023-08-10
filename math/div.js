const avg = require('./avg.js')

function getDiv(data) {
  const averagePricesByYear = avg.getAvg(data);

  const divisionPricesByYear = {}

  for (const entry of data) {
    const price = parseInt(entry.price); 
    const year = parseInt(entry.year);

    if(!divisionPricesByYear.hasOwnProperty(year)) {
      divisionPricesByYear[year] = {
        "count": 1,
        "price": Math.pow(averagePricesByYear[year] - price, 2)
      }
    } else {
      divisionPricesByYear[year].count += 1
      divisionPricesByYear[year].price += Math.pow(averagePricesByYear[year] - price, 2) 
    }
  }

  for(const year in divisionPricesByYear) {
    divisionPricesByYear[year] = Math.round(Math.sqrt(divisionPricesByYear[year].price / divisionPricesByYear[year].count))
  }

  return divisionPricesByYear
}

module.exports = {
  getDiv: getDiv
}