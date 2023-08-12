function getFuelType(string) {
  if(string.includes('hybrid (benzin/elektro)')) return 'hibrid (benzin)'
  if(string.includes('hybrid (diesel/elektro)')) return 'hibrid (dízel)'
  if(string.includes('plug-in-hybrid')) return 'hibrid'
  if(string.includes('autogas (lpg)')) return 'lpg'
  if(string.includes('erdgas (cng)')) return 'cng'
  if(string.includes('benzin')) return 'benzin'
  if(string.includes('diesel')) return 'dízel'
  if(string.includes('elektro')) return 'elektromos'
  if(string.includes('ethanol')) return 'etanol'
  if(string.includes('wasserstoff')) return 'gáz'
}

module.exports = {
  getFuelType: getFuelType
}