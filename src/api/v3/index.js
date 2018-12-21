const { signIn, signOut, switchSite } = require('./auth')
const { createSite, querySites } = require('./site')
const { queryDataSources, downloadDataSource, publishDataSource, deleteDataSource } = require('./datasource')
const { createProject, queryProjects } = require('./project')
const { queryWorkbooks, downloadWorkbook, publishWorkbook, deleteWorkbook } = require('./workbook')
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
  deleteDataSource,
  createProject,
  queryProjects,
  queryWorkbooks,
  downloadWorkbook,
  publishWorkbook,
  deleteWorkbook,
  queryViews,
  getTrustedViewUrl
}
