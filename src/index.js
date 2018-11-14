const isFunction = require('lodash.isfunction')

const request = require('./request')
const getAPIs = require('./api')

const PROXY_METHODS_EXCEPTION = [
  '$request',
  'switchSite',
  'createSite'
]

function createRequestProxy (client) {
  return new Proxy(client, {
    get: function (target, property, receiver) {
      return !PROXY_METHODS_EXCEPTION.includes(property) && isFunction(target[property])
        ? function () {
          return new Promise((resolve, reject) => {
            Reflect
              .apply(target[property], target, arguments)
              .then(data => {
                resolve(data)
              })
              .catch(e => {
                if (Object(e.response).statusCode === 401) {
                  target
                    .signIn()
                    .then(() => {
                      Reflect.apply(target[property], target, arguments)
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
    const { version } = options
    this.$options = options
    this.$request = request
    this.$jar = request.jar()
    Object.assign(this, getAPIs(version))
    return createRequestProxy(this)
  }
}

module.exports = TableauClient
