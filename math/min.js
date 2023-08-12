function getMin(data) {
  const minPricesByYear = {};
  const minOdometersByYear = {};
  const minHorsePowerByYear = {};

  for (const entry of data) {
    const odometer = parseInt(entry.odometer);
    const price = parseInt(entry.price);
    const year = parseInt(entry.year);
    const horsePower = parseInt(entry.horse_power)
  
    if (!minPricesByYear.hasOwnProperty(year)) {
        minPricesByYear[year] = price;
    } else {
        if (price < minPricesByYear[year]) {
            minPricesByYear[year] = price;
        }
    }

    if (!minOdometersByYear.hasOwnProperty(year)) {
      minOdometersByYear[year] = odometer;
    } else {
        if (odometer < minOdometersByYear[year]) {
            minOdometersByYear[year] = odometer;
        }
    }

    if (!minHorsePowerByYear.hasOwnProperty(year)) {
      minHorsePowerByYear[year] = horsePower;
    } else {
        if (horsePower < minHorsePowerByYear[year]) {
            minHorsePowerByYear[year] = horsePower;
        }
    }
  }

  return {price: minPricesByYear, odometer: minOdometersByYear, horsepower: minHorsePowerByYear}
}

module.exports = {
  getMin: getMin
};






