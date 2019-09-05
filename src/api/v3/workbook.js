const { createWriteStream, createReadStream, mkdirsSync, existsSync } = require('fs-extra')
const path = require('path')

const downloadDir = path.resolve(path.parse(require.main.filename).dir, 'downloads')

function queryWorkbooks (options = {}) {
  const { pageSize, pageNumber } = options
  const querys = []
  if (pageSize) querys.push(`pageSize=${pageSize}`)
  if (pageNumber) querys.push(`pageNumber=${pageNumber}`)
  
  return this.$request({
    method: 'GET',
    url: 'workbooks' + (querys.length ? '?' + querys.join('&') : '')
  })
}

function downloadWorkbook (workbookId, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      const dir = options.dir || downloadDir
      if (!existsSync(dir)) mkdirsSync(dir)
      const file = path.resolve(dir, workbookId + '.twb')
      const stream = createWriteStream(file)
      stream.on('finish', () => {
        resolve()
      })
      stream.on('error', err => {
        reject(err)
      })
      this.$request({
        method: 'GET',
        url: `workbooks/${workbookId}/content`
      }).pipe(stream)
    } catch (e) {
      reject(e)
    }
  })
}

function publishWorkbook ({ name, projectId, filePath, fileName, connection, showTabs }) {
  const connectionXml = connection
    ? `<connections>
        <connection serverAddress="${connection.server}" serverPort="${connection.port}">
          <connectionCredentials name="${connection.user}" password="${connection.password}" embed="${connection.embed || true}" />
        </connection>
      </connections>`
    : ''
  let showTabsValue = showTabs === true ? 'true' : 'false'
  const xmlString = `<tsRequest>
    <workbook name="${name}" showTabs="${showTabsValue}">
      ${connectionXml}
      <project id="${projectId}" />
    </workbook>
  </tsRequest>`

  return this.$request({
    method: 'POST',
    url: 'workbooks?overwrite=true',
    headers: { 'content-type': 'multipart/mixed' },
    multipart: [
      {
        'Content-Disposition': 'name="request_payload"',
        'Content-Type': 'text/xml',
        body: xmlString
      },
      {
        'Content-Disposition': `name="tableau_workbook";filename="${fileName}"`,
        'Content-Type': 'application/octet-stream',
        body: createReadStream(filePath)
      }
    ]
  })
}

function deleteWorkbook (workbookId) {
  return this
    .$request({
      method: 'DELETE',
      url: `workbooks/${workbookId}`
    })
}

module.exports = {
  queryWorkbooks,
  downloadWorkbook,
  publishWorkbook,
  deleteWorkbook
}
