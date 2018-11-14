const { signIn, signOut, switchSite } = require('./auth')
const { createSite, querySites } = require('./site')
const { queryDataSources, downloadDataSource, publishDataSource } = require('./datasource')
const { createProject, queryProjects } = require('./project')
const { queryWorkbooks, downloadWorkbook, publishWorkbook } = require('./workbook')
const { queryViews, getTrustedViewUrl } = require('./view')

module.exports = {
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
  publishWorkbook,
  queryViews,
  getTrustedViewUrl
}
