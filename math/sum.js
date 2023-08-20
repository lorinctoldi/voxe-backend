const min = require('./min')
const max = require('./max')
const med = require('./med')
const avg = require('./avg')
const div = require('./div')

function getSum(data) {
  [minValue, maxValue, medValue, avgValue, divValue] = [min.getMin(data), max.getMax(data), med.getMed(data), avg.getAvg(data), div.getDiv(data)]

  const dataByYears = {}

  for(year in minValue) {
    // dataByYears[year] = { min: minValue[year], max: maxValue[year], med: medValue[year], avg: avgValue[year], div: divValue[year] }
    dataByYears[year] = { min: minValue[year], max: maxValue[year], avg: avgValue[year] }
  }
  
  return dataByYears
}

module.exports = {
  getSum: getSum
}