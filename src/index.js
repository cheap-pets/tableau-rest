const request = require('superagent')
const rpc = require('./rpc')

const PROXY_METHODS = [ 'switchSite', '' ]

function createRetryRequestProxy (client) {
  return new Proxy(client, {
    get: function (target, property, receiver) {
      return (PROXY_METHODS.includes(property) && (typeof target[property] === 'function'))
        ? function () {
          try {
            Reflect.apply(property, target, arguments)
          } catch (e) {
            if (e.tableauErrorCode === '401002') {
              return target.login().then(() => Reflect.apply(property, target, arguments))
            } else throw e
          }
        }
        : Reflect.get(target, property, receiver)
    }
  })
}

class TableauClient {
  constructor (options = { }) {
    this.agent = request.agent()
    return createRetryRequestProxy(this)
  }

  async login (options) {

  }

  logout () {

  }

  switchSite (contentUrl) {

  }

  createSite (options = {}) {

  }

  suspendSite (contentUrl) {

  }

  querySites (options = {}) {

  }

  queryWorkbooks (options = {}) {

  }

  downloadWorkbook (options = {}) {

  }

  publishWorkbook (options = {}) {

  }

  queryViews (options = {}) {

  }

  queryDataSources (options = {}) {

  }

  downloadDataSource (options = {}) {

  }

  publishDataSource (options = {}) {

  }
}

module.exports = TableauClient
