const sum = require('../math/sum')
const mobile = require('../scraper/mobile')
const hasznaltauto = require('../scraper/hasznaltauto')
const fs =  require('fs')

function normalize(items, summary) {
  console.log(summary)
  for(const item of items) {
    const year = String(item.year)
    if(item.price < summary.price.min[year]) item.score = 1;
    else item.score = 0;
  }

  return items.filter(item => item.score === 1)
}

async function getIt() {
  const items = await mobile.scrapeAllData(1900, 40)
  const hasznaltautoItems = await hasznaltauto.scrapeAllData(12, 11204)
  const summary = sum.getSum(hasznaltautoItems)
  const res = normalize(items, summary)
  fs.writeFileSync('writed.json', JSON.stringify(res, null, 2))
  console.log('írás kész')
}
getIt()
