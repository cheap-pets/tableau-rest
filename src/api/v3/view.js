function queryViews (options = {}) {
  return this.$request({
    method: 'GET',
    url: 'views'
  })
}

module.exports = {
  queryViews
}
