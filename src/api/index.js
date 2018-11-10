const v3 = require('./v3')

function getAPIs (version) {
  const vArr = version.toString().split('.')
  return vArr[0] === '3' ? v3 : undefined
}

module.exports = getAPIs
