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

  return medianPricesByYear
}

module.exports = {
  getMed: getMed
}