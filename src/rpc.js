const request = require('request-promise-native')

const BASE_REQUEST_OPTIONS = {
  json: true,
  followAllRedirects: true
}

const HOST = 'http://tableau.mctech.vip'
const API_ROOT = 'http://tableau.mctech.vip/api/3.1'
const USER_NAME = 'admin'
const USER_PASS = '123qwe'

const credentials = {}

async function _getCredential (siteContentUrl) {
  if (credentials[siteContentUrl || '$']) return credentials[siteContentUrl || '$']

  const jar = request.jar()
  const result = await request({
    ...BASE_REQUEST_OPTIONS,
    method: 'POST',
    url: API_ROOT + '/auth/signin',
    body: {
      credentials: {
        name: USER_NAME,
        password: USER_PASS,
        site: {
          contentUrl: siteContentUrl || ''
        }
      }
    },
    jar
  })
  const credential = {
    jar,
    token: result.credentials.token,
    siteId: result.credentials.site.id
  }
  credentials[siteContentUrl || '$'] = credential
  return credential
}

async function _request ({ method, url, body }, siteContentUrl, ctx) {
  const { token, jar } = await _getCredential(siteContentUrl)
  let result
  try {
    result = await request({
      ...BASE_REQUEST_OPTIONS,
      method,
      url: API_ROOT + url,
      body,
      headers: {
        'X-Tableau-Auth': token
      },
      jar
    })
  } catch (err) {
    const status = Object(err.response).statusCode
    if (status >= 400 || status < 500) {
      delete credentials[siteContentUrl || '$']
    } else {
      console.error(err.message || err)
    }
    ctx.status = status || 500
    ctx.body = { message: 'try again.' }
  }
  return result
}

async function querySites (ctx, next) {
  const data = await _request(
    {
      method: 'GET',
      url: '/sites'
    },
    null,
    ctx
  )
  if (data) ctx.body = data.sites.site
}

async function queryProjects (ctx, next) {
  const { site } = ctx.query
  const { siteId } = await _getCredential(site)

  const data = await _request(
    {
      method: 'GET',
      url: `/sites/${siteId}/projects`
    },
    site,
    ctx
  )
  if (data) ctx.body = data.projects.project
}

async function queryWorkbooks (ctx, next) {
  const { site } = ctx.query
  const { siteId } = await _getCredential(site)

  const data = await _request(
    {
      method: 'GET',
      url: `/sites/${siteId}/workbooks`
    },
    site,
    ctx
  )
  if (data) ctx.body = data.workbooks.workbook
}

async function queryViews (ctx, next) {
  const { site, bookId } = ctx.query
  const { siteId } = await _getCredential(site)

  const data = await _request(
    {
      method: 'GET',
      url: bookId ? `/sites/${siteId}/workbooks/${bookId}/views` : `/sites/${siteId}/views`
    },
    site,
    ctx
  )
  if (data) ctx.body = data.views.view
}

async function getViewUrl (ctx, next) {
  const { site, contentUrl } = ctx.query
  const form = { username: USER_NAME }
  if (site) form.target_site = site
  const host = 'http://172.18.1.77'
  const ticket = await request({
    ...BASE_REQUEST_OPTIONS,
    method: 'POST',
    url: `${host}/trusted`,
    form,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  })
  const arr = contentUrl.split('/')
  const idx = arr.lastIndexOf('sheets')
  arr.splice(idx, 1)
  const viewUrl = arr.join('/')
  ctx.body = site
    ? `${HOST}/trusted/${ticket}/t/${site}/views/${viewUrl}`
    : `${HOST}/trusted/${ticket}/views/${viewUrl}`
}

module.exports = {
  querySites,
  queryProjects,
  queryWorkbooks,
  queryViews,
  getViewUrl
}
