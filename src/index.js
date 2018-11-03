const $request = require('./request')

const { signIn, signOut } = require('./auth')
const { switchSite, createSite, querySites } = require('./site')
const { queryDataSources, downloadDataSource, publishDataSource } = require('./datasource')
const { createProject, queryProjects } = require('./project')
const { queryWorkbooks, downloadWorkbook, publishWorkbook } = require('./workbook')

const PROXY_METHODS = [
  'switchSite',
  'createSite',
  'querySites',
  'queryDataSources',
  'downloadDataSource',
  'publishDataSource',
  'createProject',
  'queryProjects',
  'queryWorkbooks',
  'downloadWorkbook',
  'publishWorkbook'
]

function createRetryRequestProxy (client) {
  return new Proxy(client, {
    get: function (target, property, receiver) {
      return PROXY_METHODS.includes(property) && typeof target[property] === 'function'
        ? function () {
          return new Promise((resolve, reject) => {
            Reflect
              .apply(target[property], target, arguments)
              .then(data => {
                resolve(data)
              })
              .catch(e => {
                if (e.status === 401) {
                  target
                    .signIn()
                    .then(() => {
                      Reflect
                        .apply(target[property], target, arguments)
                        .then(data => {
                          resolve(data)
                        })
                        .catch(err => {
                          reject(err)
                        })
                    })
                    .catch(err => {
                      reject(err)
                    })
                } else {
                  reject(e)
                }
              })
          })
        }
        : Reflect.get(target, property, receiver)
    }
  })
}

class TableauClient {
  constructor (options = {}) {
    const { host, apiVersion } = options
    this.$options = options
    this.$host = host
    this.$apiRoot = `${host}/api/${apiVersion || '3.1'}`
    this.$jar = $request.jar()
    if (options.autoSignIn !== false) this.signIn()
    return createRetryRequestProxy(this)
  }
}

Object.assign(TableauClient.prototype, {
  $request,
  signIn,
  signOut,
  switchSite,
  createSite,
  querySites,
  queryDataSources,
  downloadDataSource,
  publishDataSource,
  createProject,
  queryProjects,
  queryWorkbooks,
  downloadWorkbook,
  publishWorkbook
})

module.exports = TableauClient
