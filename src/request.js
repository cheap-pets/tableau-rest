const req = require('request-promise-native')

const BASE_REQUEST_OPTIONS = {
  json: true,
  followAllRedirects: true
}

function request (options = {}) {
  const { host, version, requestTimeout } = this.$options
  const urlSitePart = options.site === false ? '' : `sites/${this.$siteId}/`
  options.url = `${host}/api/${version}/${urlSitePart}` + options.url
  if (requestTimeout && !options.timeout) options.timeout = requestTimeout
  delete options.site
  const headers = Object.assign({}, options.headers)
  if (this.$token) headers['X-Tableau-Auth'] = this.$token
  Object.assign(
    options,
    BASE_REQUEST_OPTIONS,
    { jar: this.$jar, headers, rejectUnauthorized: this.$options.rejectUnauthorized })
  return req(options)
}

request.jar = req.jar

module.exports = request
