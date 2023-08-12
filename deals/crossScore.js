const sum = require('../math/sum')
const mobile = require('../scraper/mobile')
const hasznaltauto = require('../scraper/hasznaltauto')
const fs =  require('fs')

function normalize(items, summary) {

  console.log(summary)
  for(const item of items) {
    const year = String(item.year)
    const normalized_price = (item.price - summary.price.min[year]) / (summary.price.max[year] - summary.price.min[year])
    const normalized_odometer = (item.odometer - summary.odometer.min[year]) / (summary.odometer.max[year] - summary.odometer.min[year])
    const normalized_horsepower = (item.horse_power - summary.horsepower.min[year]) / (summary.horsepower.max[year] - summary.horsepower.min[year])
    const normalized_year = (item.year - Object.keys(summary.price.min)[0]) / (Object.keys(summary.price.min).at(-1) - Object.keys(summary.price.min)[0])

    item.score = (0.45 * normalized_price) + (0.10 * normalized_odometer) + (0.10 * normalized_horsepower) + (0.35 * normalized_year)
  }

  return items
}

async function getIt() {
  const items = await mobile.scrapeAllData(3500, 330)
  const hasznaltautoItems = await hasznaltauto.scrapeAllData(22, 27227)
  const summary = sum.getSum(hasznaltautoItems)
  const res = normalize(items, summary).sort((a,b) => a.score - b.score)
  fs.writeFileSync('writed.json', JSON.stringify(res, null, 2))
  console.log('írás kész')
}
getIt()
