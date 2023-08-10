function getMin(data) {
  const minPricesByYear = {};

  for (const entry of data) {
    const price = parseInt(entry.price);
    const year = parseInt(entry.year);
  
    if (!minPricesByYear.hasOwnProperty(year)) {
        minPricesByYear[year] = price;
    } else {
        if (price < minPricesByYear[year]) {
            minPricesByYear[year] = price;
        }
    }
  }

  return minPricesByYear
}

module.exports = {
  getMin: getMin
};






