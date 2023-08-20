function filter (data) {
  const totalPrices = data.reduce((sum, listing) => sum + listing.price, 0);
  const averagePrice = totalPrices / data.length;
  
  // Define a percentage for the dynamic threshold (e.g., 10%)
  const thresholdPercentage = 0.85;  // 30%
  
  // Calculate the dynamic threshold
  const dynamicSuspiciousPriceThreshold = averagePrice * (1 - thresholdPercentage);
  
  // Filter out listings with prices below the dynamic threshold
  const filteredData = data.filter(listing => listing.price >= dynamicSuspiciousPriceThreshold);
  return filteredData
}

module.exports = {
  filter: filter
}