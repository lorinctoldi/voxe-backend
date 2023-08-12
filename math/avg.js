function getAvg(data) {
  const avaragePricesByYear = {};
  const avarageOdometersByYear = {};
  const avarageHorsePowerByYear = {};

  for (const entry of data) {
      const price = parseInt(entry.price); 
      const year = parseInt(entry.year);
      const odometer = parseInt(entry.odometer);
      const horsePower = parseInt(entry.horse_power)

      if (!avaragePricesByYear.hasOwnProperty(year)) {
          avaragePricesByYear[year] = { total: 0, count: 0 };
      }

      if (!avarageOdometersByYear.hasOwnProperty(odometer)) {
        avarageOdometersByYear[year] = { total: 0, count: 0 }
      }

      if (!avarageHorsePowerByYear.hasOwnProperty(horsePower)) {
        avarageHorsePowerByYear[year] = { total: 0, count: 0 }
      }

      avaragePricesByYear[year].total += price;
      avaragePricesByYear[year].count++;

      avarageOdometersByYear[year].total += odometer;
      avarageOdometersByYear[year].count++;

      avarageHorsePowerByYear[year].total += horsePower;
      avarageHorsePowerByYear[year].count++;
  }

  for (const year in avaragePricesByYear) {
      const count = avaragePricesByYear[year].count;
      const avaragePrice = count !== 0 ? avaragePricesByYear[year].total / count : "No data available";
      avaragePricesByYear[year] = Number(avaragePrice.toFixed(0))
  }

  for (const year in avarageOdometersByYear) {
      const count = avarageOdometersByYear[year].count;
      const avarageOdometer= count !== 0 ? avarageOdometersByYear[year].total / count : "No data available";
      avarageOdometersByYear[year] = Number(avarageOdometer.toFixed(0))
  }

  for (const year in avarageHorsePowerByYear) {
      const count = avarageHorsePowerByYear[year].count;
      const avarageHorsePower = count !== 0 ? avarageHorsePowerByYear[year].total / count : "No data available";
      avarageHorsePowerByYear[year] = Number(avarageHorsePower.toFixed(0))
  }

  return {price: avaragePricesByYear, odometer: avarageOdometersByYear, horsepower: avarageHorsePowerByYear}
}

module.exports = {
  getAvg: getAvg
};