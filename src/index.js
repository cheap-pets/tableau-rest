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
      return !PROXY_METHODS_EXCEPTION.includes(property) && typeof target[property] === 'function'
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
    const { host, version, autoSignIn } = options
    this.$options = options
    this.$host = host
    this.$request = request
    this.$jar = request.jar()
    Object.assign(this, getAPIs(version))
    if (autoSignIn !== false && this.signIn) this.signIn()
    return createRequestProxy(this)
  }
}

module.exports = TableauClient
