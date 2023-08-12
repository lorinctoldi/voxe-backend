const avg = require('./avg.js')

function getDiv(data) {
  res = avg.getAvg(data)
  const avaragePricesByYear = res.price
  const avarageOdometerByYear = res.odometer
  const avarageHorsePowerByYear = res.horsepower

  const divisionPricesByYear = {}
  const divisionOdometersByYear = {}
  const divisionHorsePowerByYear = {}

  for (const entry of data) {
    const price = parseInt(entry.price); 
    const odometer = parseInt(entry.odometer)
    const horsePower = parseInt(entry.horse_power)
    const year = parseInt(entry.year);

    if(!divisionPricesByYear.hasOwnProperty(year)) {
      divisionPricesByYear[year] = {
        "count": 1,
        "price": Math.pow(avaragePricesByYear[year] - price, 2)
      }
    } else {
      divisionPricesByYear[year].count += 1
      divisionPricesByYear[year].price += Math.pow(avaragePricesByYear[year] - price, 2) 
    }

    if(!divisionOdometersByYear.hasOwnProperty(year)) {
      divisionOdometersByYear[year] = {
        "count": 1,
        "odometer": Math.pow(avarageOdometerByYear[year] - odometer, 2)
      }
    } else {
      divisionOdometersByYear[year].count += 1
      divisionOdometersByYear[year].odometer += Math.pow(avarageOdometerByYear[year] - odometer, 2) 
    }

    if(!divisionHorsePowerByYear.hasOwnProperty(year)) {
      divisionHorsePowerByYear[year] = {
        "count": 1,
        "horsepower": Math.pow(avarageHorsePowerByYear[year] - horsePower, 2)
      }
    } else {
      divisionHorsePowerByYear[year].count += 1
      divisionHorsePowerByYear[year].horsepower += Math.pow(avarageHorsePowerByYear[year] - (horsePower || 0), 2) 
    }
  }

  for(const year in divisionPricesByYear) {
    divisionPricesByYear[year] = Math.round(Math.sqrt(divisionPricesByYear[year].price / divisionPricesByYear[year].count))
  }
  
  for(const year in divisionOdometersByYear) {
    divisionOdometersByYear[year] = Math.round(Math.sqrt(divisionOdometersByYear[year].odometer / divisionOdometersByYear[year].count))
  }
  
  for(const year in divisionHorsePowerByYear) {
    console.log(divisionHorsePowerByYear[year])
    divisionHorsePowerByYear[year] = Math.round(Math.sqrt(divisionHorsePowerByYear[year].horsepower / divisionHorsePowerByYear[year].count))
  }

  return { price: divisionPricesByYear, odometer: divisionOdometersByYear, horsepower: divisionHorsePowerByYear}
}

module.exports = {
  getDiv: getDiv
}