function signIn (options = {}) {
  Object.assign(this.$options, options)
  const { user, password, site } = this.$options
  this.$site = site || ''

  return this.$request({
    method: 'POST',
    url: `${this.$apiRoot}/auth/signin`,
    body: {
      credentials: {
        name: user,
        password: password,
        site: {
          contentUrl: site || ''
        }
      }
    }
  }).then(data => {
    const { credentials } = data
    this.$siteId = credentials.site.id
    this.$token = credentials.token
  })
}

function signOut () {
  return this.$request({
    method: 'POST',
    url: `${this.$apiRoot}/auth/signout`
  }).then(() => {
    delete this.$token
  })
}

module.exports = {
  signIn,
  signOut
}
