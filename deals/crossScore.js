const sum = require('../math/sum')
const mobile = require('../scraper/mobile')
const hasznaltauto = require('../scraper/hasznaltauto')
const fs =  require('fs')

function normalize(items, reverseSummary, summary) {
  console.log(reverseSummary)
  for(const item of items) {
    const year = String(item.year)
    const normalized_less_than_minimum_price = item.price  < (reverseSummary.price.min[year] - (reverseSummary.price.min[year] * 0.08)) ? 0.25 : 0
    const normalized_odometer = normalized_less_than_minimum_price ? 0 : (item.odometer - summary.odometer.min[year]) / (summary.odometer.max[year] - summary.odometer.min[year])
    const normalized_horsepower = (item.horse_power - summary.horsepower.min[year]) / (summary.horsepower.max[year] - summary.horsepower.min[year])
    const reverse_normalized_price = (item.price - reverseSummary.price.min[year]) / (reverseSummary.price.max[year] - reverseSummary.price.min[year])
    const reverse_normalized_odometer = (item.odometer - reverseSummary.odometer.min[year]) / (reverseSummary.odometer.max[year] - reverseSummary.odometer.min[year])
    const reverse_normalized_horsepower = (item.horse_power - reverseSummary.horsepower.min[year]) / (reverseSummary.horsepower.max[year] - reverseSummary.horsepower.min[year])
    // const normalized_year = (item.year - Object.keys(summary.price.min)[0]) / (Object.keys(summary.price.min).at(-1) - Object.keys(summary.price.min)[0])
    console.log(normalized_less_than_minimum_price, normalized_odometer, normalized_horsepower, reverse_normalized_odometer, reverse_normalized_horsepower, reverse_normalized_price)
    item.score = normalized_less_than_minimum_price + ((1- reverse_normalized_price) * 0.25) + ((1-normalized_odometer) * 0.0625) + ((1-reverse_normalized_odometer) * 0.0625) +(normalized_horsepower * 0.0625) + (reverse_normalized_horsepower * 0.0625)
  }

  return items
}

async function getScoredItems(mobileMake, mobileModel, hasznaltautoMake, hasznaltautoModel, startYear, endYear) {
  const mobileItems = await mobile.scrapeAllData(mobileMake, mobileModel, startYear, endYear)
  const hasznaltautoItems = await hasznaltauto.scrapeAllData(hasznaltautoMake, hasznaltautoModel, undefined, startYear, endYear)
  const mobile_summary = sum.getSum(mobileItems)
  const hasznaltauto_summary = sum.getSum(hasznaltautoItems)
  const mobileScored = normalize(mobileItems, hasznaltauto_summary, mobile_summary).sort((a,b) => b.score - a.score).filter(o => o.score !== null)
  const hasznaltautoScored = normalize(hasznaltautoItems, mobile_summary, hasznaltauto_summary).sort((a,b) => b.score - a.score).filter(o => o.score !== null)
  return {mobile: mobileScored, hasznaltautoScored: hasznaltautoScored}
}

module.exports = {
  getScoredItems: getScoredItems
}
