function getMax(data) {
  const maxPricesByYear = {};

  for (const entry of data) {
    const price = parseInt(entry.price);
    const year = parseInt(entry.year);
  
    if (!maxPricesByYear.hasOwnProperty(year)) {
        maxPricesByYear[year] = price;
    } else {
        if (price > maxPricesByYear[year]) {
            maxPricesByYear[year] = price;
        }
    }
  }

  return maxPricesByYear
}

module.exports = {
  getMax: getMax
}