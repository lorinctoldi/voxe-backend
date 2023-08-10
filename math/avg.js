function getAvg(data) {
  const averagePricesByYear = {};

  for (const entry of data) {
      const price = parseInt(entry.price); 
      const year = parseInt(entry.year);

      if (!averagePricesByYear.hasOwnProperty(year)) {
          averagePricesByYear[year] = { total: 0, count: 0 };
      }

      averagePricesByYear[year].total += price;
      averagePricesByYear[year].count++;
  }

  for (const year in averagePricesByYear) {
      const count = averagePricesByYear[year].count;
      const averagePrice = count !== 0 ? averagePricesByYear[year].total / count : "No data available";
      averagePricesByYear[year] = Number(averagePrice.toFixed(0))
  }

  return averagePricesByYear
}

module.exports = {
  getAvg: getAvg
};