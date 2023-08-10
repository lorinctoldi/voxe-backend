const min = require('./min')
const max = require('./max')
const med = require('./med')
const avg = require('./avg')

function getSum(data) {
  [minValue, maxValue, medValue, avgValue] = [min.getMin(data), max.getMax(data), med.getMed(data), avg.getAvg(data)]

  const dataByYears = {}

  for(year in minValue) {
    dataByYears[year] = { min: minValue[year], max: maxValue[year], med: medValue[year], avg: avgValue[year] }
  }
  
  return dataByYears
}

module.exports = {
  getSum: getSum
}