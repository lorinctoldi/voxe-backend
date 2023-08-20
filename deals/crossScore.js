const sum = require('../math/sum')
const mobile = require('../scraper/mobile')
const hasznaltauto = require('../scraper/hasznaltauto')

function getScore (data, sum, crossSum) {
  for(const entry of data) {
    const years = Object.keys(sum.price.min)
    const price = entry.price
    const odometer = entry.odometer
    const horsepower = entry.horse_power
    const cross_years = Object.keys(crossSum.price.min)


    // minimum (cross)
    const lessThenMinimum = []

    for(let year of cross_years) {
      if(year > entry.year) break;
      if(price < crossSum.price.min[year]) {
        lessThenMinimum.push(parseFloat(
          (crossSum.price.min[year] - price) * (1 + ((entry.year - year) * 0.10)) / 100_000 ) - lessThenMinimum.reduce((a,c) => a + c, 0)) 
      }
    }

    let ltm = lessThenMinimum.reduce((accumulator, currentValue) => accumulator + currentValue, 0)



    // avarage price
    const avarage = [];

    for(let year of years) {
      if(year > entry.year) break;
      avarage.push(
        parseFloat(
          (((sum.price.avg[year] - price) * (1 + ((entry.year - year) * 0.07)))) / 100_000 - avarage.reduce((a,c) => a + c, 0))
      )
    }

    let avg = avarage.reduce((accumulator, currentValue) => accumulator + currentValue, 0)

    // cross avarage price
    const cAvarage = []
    for(let year of cross_years) {
      if(year > entry.year) break;
      cAvarage.push(
        parseFloat(
          (((crossSum.price.avg[year] - price) * (1 + ((entry.year - year) * 0.07)))) / 100_000 - cAvarage.reduce((a,c) => a + c, 0))
      )
    }

    let c_avg = cAvarage.reduce((accumulator, currentValue) => accumulator + currentValue, 0)


    // year score
    let year_score = Math.abs(years[0] - (entry.year + 1)) 


    // avarage odometer
    const odometerAvarage = [];

    for(let year of years) {
      if(year > entry.year) break;
      odometerAvarage.push(
        parseFloat(
          (((sum.odometer.avg[year] - odometer) * (1 + ((entry.year - year) * 0.07)))) / 10_000 - odometerAvarage.reduce((a,c) => a + c, 0))
      )
    }

    let odm = odometerAvarage.reduce((accumulator, currentValue) => accumulator + currentValue, 0)


    // cross avarage odometer
    const cOdometerAvarage = []

    for(let year of cross_years) {
      if(year > entry.year) break;
      cOdometerAvarage.push(
        parseFloat(
          (((crossSum.odometer.avg[year] - odometer) * (1 + ((entry.year - year) * 0.07)))) / 10_000 - cOdometerAvarage.reduce((a,c) => a + c, 0))
      )
    }

    let codm = cOdometerAvarage.reduce((accumulator, currentValue) => accumulator + currentValue, 0)


    // avarage horse power
    const horse = [];

    for(let year of years) {
      horse.push(
          (horsepower - sum.horsepower.avg[year]) / 100 - horse.reduce((a,c) => a + c, 0)
      )
    }

    let hrs = horse.reduce((accumulator, currentValue) => accumulator + currentValue, 0)


    // cross avarage horse 
    const chorse = [];

    for(let year of years) {
      chorse.push(
          (horsepower - sum.horsepower.avg[year]) / 100 - chorse.reduce((a,c) => a + c, 0)
      )
    }

    let chrs = chorse.reduce((accumulator, currentValue) => accumulator + currentValue, 0)

    
    const score = ((ltm)||0) + ((year_score * 20)||0) + ((odm * 10)||0) + ((codm * 10)||0) + ((hrs * 4)||0) + ((chrs * 4)||0)
    entry.score = score
    entry.odm = odm
    entry.codm = codm
    entry.year_score = year_score
    entry.isLessThanMinimum = entry.price <= crossSum.price.min[entry.year]
    entry.lessThenMinimum = ltm > 0 ? parseInt(ltm * 100_000).toLocaleString('en-US').replace(/,/g, '.') : null
  }

  return data.sort((a,b) => b.score - a.score)
}


async function getScoredItems(mobileMake, mobileModel, hasznaltautoMake, hasznaltautoModel, startYear, endYear) {
  const mobileItems = await mobile.scrapeAllData(mobileMake, mobileModel, startYear, endYear)
  const hasznaltautoItems = await hasznaltauto.scrapeAllData(hasznaltautoMake, hasznaltautoModel, undefined, startYear, endYear)
  const mobile_summary = sum.getSum(mobileItems)
  const hasznaltauto_summary = sum.getSum(hasznaltautoItems)
  const mobileScored = getScore(mobileItems, mobile_summary, hasznaltauto_summary)
  const hasznaltautoScored = getScore(hasznaltautoItems, hasznaltauto_summary, mobile_summary)
  return {mobile: mobileScored, hasznaltautoScored: hasznaltautoScored}
}

module.exports = {
  getScoredItems: getScoredItems
}
