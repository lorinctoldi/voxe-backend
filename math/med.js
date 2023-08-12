function getMed(data) {
  function calculateMedian(numbers) {
    const sortedNumbers = numbers.slice().sort((a, b) => a - b);
    const middleIndex = Math.floor(sortedNumbers.length / 2);
  
    if (sortedNumbers.length % 2 === 0) {
        const medianA = sortedNumbers[middleIndex - 1];
        const medianB = sortedNumbers[middleIndex];
        return (medianA + medianB) / 2;
    } else {
        return sortedNumbers[middleIndex];
    }
  }
  
  const medianPricesByYear = {};
  const medianOdometersByYear = {};
  const medianHorsePowerByYear = {};
  
  for (const entry of data) {
    const price = parseInt(entry.price);
    const year = parseInt(entry.year);
  
    if (!medianPricesByYear.hasOwnProperty(year)) {
        medianPricesByYear[year] = [];
    }
  
    medianPricesByYear[year].push(price);
  }

  for (const year in medianPricesByYear) {
    const medianPrice = calculateMedian(medianPricesByYear[year]);
    medianPricesByYear[year] = medianPrice
  }

  for (const entry of data) {
    const odometer = parseInt(entry.odometer);
    const year = parseInt(entry.year);
  
    if (!medianOdometersByYear.hasOwnProperty(year)) {
        medianOdometersByYear[year] = [];
    }
  
    medianOdometersByYear[year].push(odometer);
  }

  for (const year in medianOdometersByYear) {
    const medianOdometer = calculateMedian(medianOdometersByYear[year]);
    medianOdometersByYear[year] = medianOdometer
  }

  for (const entry of data) {
    const horsePower = parseInt(entry.horse_power);
    const year = parseInt(entry.year);
  
    if (!medianHorsePowerByYear.hasOwnProperty(year)) {
        medianHorsePowerByYear[year] = [];
    }
  
    medianHorsePowerByYear[year].push(horsePower);
  }

  for (const year in medianHorsePowerByYear) {
    const medianHorsePower = calculateMedian(medianHorsePowerByYear[year]);
    medianHorsePowerByYear[year] = medianHorsePower
  }


  return {price: medianPricesByYear, odometer: medianOdometersByYear, horsepower: medianHorsePowerByYear}
}

module.exports = {
  getMed: getMed
}