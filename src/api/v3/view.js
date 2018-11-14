const isInteger = require('lodash.isinteger')
const request = require('request-promise-native')

function queryViews (options = {}) {
  const { pageSize, pageNumber, name, projectId, projectName, workbookId, workbookName } = options

  let query = ''
  if (isInteger(pageSize)) query += `&pageSize=${pageSize}`
  if (isInteger(pageNumber)) query += `&pageNumber=${pageNumber}`
  if (name) query += `&filter=name:eq:${name}`

  let url = workbookId ? `workbooks/${workbookId}/views` : 'views'
  if (query.length) url += '?' + query.substr(1)

  return this
    .$request({
      method: 'GET',
      url
    })
    .then(data => {
      if (projectId || projectName || workbookName) {
        data.views.view = data.views.view.filter(({ project, workbook }) => {
          return (!projectId || project.id === projectId) &&
            (!projectName || project.name === projectName) &&
            (!workbookName || workbook.name === workbookName)
        })
      }
      return data
    })
}

function getTrustedViewUrl ({ host, site, contentUrl, userName }) {
  const form = { username: userName || this.$options.user }
  site = (site || site === '') ? site : this.$site
  if (site) form.target_site = site
  return request({
    followAllRedirects: true,
    method: 'POST',
    url: `${host || this.$options.host}/trusted`,
    form,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  }).then(ticket => {
    if (ticket.toString() === '-1') return -1
    const arr = contentUrl.split('/')
    const idx = arr.lastIndexOf('sheets')
    if (idx) arr.splice(idx, 1)
    const viewPart = arr.join('/')
    const sitePart = site ? `/t/${site}` : ''
    return `${host}/trusted/${ticket}${sitePart}/views/${viewPart}`
  })
}

module.exports = {
  queryViews,
  getTrustedViewUrl
}
