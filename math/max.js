function getMax(data) {
  const maxPricesByYear = {};
  const maxOdometerByYear = {};
  const maxHorsePowerByYear = {};

  for (const entry of data) {
    const price = parseInt(entry.price);
    const odometer = parseInt(entry.odometer);
    const year = parseInt(entry.year);
    const horsePower = parseInt(entry.horse_power)
  
    if (!maxPricesByYear.hasOwnProperty(year)) {
        maxPricesByYear[year] = price;
    } else {
        if (price > maxPricesByYear[year]) {
            maxPricesByYear[year] = price;
        }
    }

    if (!maxOdometerByYear.hasOwnProperty(year)) {
        maxOdometerByYear[year] = odometer;
    } else {
        if (odometer > maxOdometerByYear[year]) {
            maxOdometerByYear[year] = odometer;
        }
    }

    if (!maxHorsePowerByYear.hasOwnProperty(year)) {
        maxHorsePowerByYear[year] = horsePower;
    } else {
        if (horsePower > maxHorsePowerByYear[year]) {
            maxHorsePowerByYear[year] = horsePower;
        }
    }
  }

  return {price: maxPricesByYear, odometer: maxOdometerByYear, horsepower: maxHorsePowerByYear }
}

module.exports = {
  getMax: getMax
}