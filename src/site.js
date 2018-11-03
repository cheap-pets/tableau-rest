function switchSite (contentUrl) {
  return this
    .$request({
      method: 'POST',
      url: `${this.$apiRoot}/auth/switchSite`,
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

function createSite (name, contentUrl) {
  return this
    .$request({
      method: 'POST',
      url: `${this.$apiRoot}/sites`,
      body: {
        site: {
          name,
          contentUrl: contentUrl || name
        }
      }
    })
}

function suspendSite (contentUrl) {

}

function querySites (options = {}) {
  return this
    .$request({
      method: 'GET',
      url: `${this.$apiRoot}/sites`
    })
    .then(data => {
      return data.sites.site
    })
}

module.exports = {
  switchSite,
  createSite,
  suspendSite,
  querySites
}
