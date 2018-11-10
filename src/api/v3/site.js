function createSite (name, contentUrl) {
  return this
    .$request({
      sited: false,
      method: 'POST',
      url: 'sites',
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
      sited: false,
      method: 'GET',
      url: 'sites'
    })
    .then(data => {
      return data.sites.site
    })
}

module.exports = {
  createSite,
  suspendSite,
  querySites
}
