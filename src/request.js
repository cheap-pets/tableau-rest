const req = require('request-promise-native')

const BASE_REQUEST_OPTIONS = {
  json: true,
  followAllRedirects: true
}

function request (options = {}) {
  const { host, version } = this.$options
  const urlSitePart = options.sited ? `sites/${this.$siteId}/` : ''
  options.url = `${host}/api/${version}/${urlSitePart}` + options.url
  delete options.sited
  const headers = Object.assign({}, options.headers)
  if (this.$token) headers['X-Tableau-Auth'] = this.$token
  Object.assign(options, BASE_REQUEST_OPTIONS, { jar: this.$jar, headers })
  return req(options)
}

request.jar = req.jar

module.exports = request
