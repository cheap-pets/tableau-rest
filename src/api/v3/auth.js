function signIn (options) {
  if (options) this.$options = options
  const { user, password, site } = this.$options
  this.$site = site || ''

  return this.$request({
    site: false,
    method: 'POST',
    url: 'auth/signin',
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
    site: false,
    method: 'POST',
    url: 'auth/signout'
  }).then(() => {
    delete this.$token
  })
}

function switchSite (contentUrl) {
  return this
    .$request({
      site: false,
      method: 'POST',
      url: 'auth/switchSite',
      body: {
        site: {
          contentUrl
        }
      }
    })
    .then(data => {
      this.$siteId = data.credentials.site.id
      this.$token = data.credentials.token
    })
}

module.exports = {
  signIn,
  signOut,
  switchSite
}
