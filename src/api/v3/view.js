const isInteger = require('lodash.isinteger')

function queryViews (options = {}) {
  const { pageSize, pageNumber, projectId, projectName, workbookId, workbookName } = options

  let query = ''
  if (isInteger(pageSize)) query += `&pageSize=${pageSize}`
  if (isInteger(pageNumber)) query += `&pageNumber=${pageNumber}`

  let url = workbookId ? `workbooks/${workbookId}/views` : 'views'
  if (query.length) url += '?' + query.substr(1)

  return this
    .$request({
      method: 'GET',
      url
    })
    .then(data => {
      if (projectId || projectName || workbookName) {
        data.views.view = data.views.view.filter(({ project, workbook }) => {
          return (!projectId || project.id === projectId) &&
            (!projectName || project.name === projectName) &&
            (!workbookName || workbook.name === workbookName)
        })
      }
      return data
    })
}

module.exports = {
  queryViews
}
