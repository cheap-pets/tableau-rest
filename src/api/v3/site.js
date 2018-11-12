function createSite (name, contentUrl) {
  return this
    .$request({
      site: false,
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
      site: false,
      method: 'GET',
      url: 'sites'
    })
}

module.exports = {
  createSite,
  suspendSite,
  querySites
}
