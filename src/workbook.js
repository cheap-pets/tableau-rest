const { createWriteStream, createReadStream, mkdirsSync, existsSync } = require('fs-extra')
const path = require('path')

const downloadDir = path.resolve(path.parse(require.main.filename).dir, 'downloads')

function queryWorkbooks (options = {}) {
  return this.$request({
    method: 'GET',
    url: `${this.$apiRoot}/sites/${this.$siteId}/workbooks`
  }).then(data => {
    return data.workbooks.workbook
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
        url: `${this.$apiRoot}/sites/${this.$siteId}/workbooks/${workbookId}/content`
      }).pipe(stream)
    } catch (e) {
      reject(e)
    }
  })
}

function publishWorkbook ({ name, projectId, filePath, fileName, connection }) {
  const connectionXml = connection
    ? `<connections>
        <connection serverAddress="${connection.server}" serverPort="${connection.port}">
          <connectionCredentials name="${connection.user}" password="${connection.password}" embed="${connection.embed || true}" />
        </connection>
      </connections>`
    : ''
  const xmlString = `<tsRequest>
    <workbook name="${name}">
      ${connectionXml}
      <project id="${projectId}" />
    </workbook>
  </tsRequest>`

  return this.$request({
    method: 'POST',
    url: `${this.$apiRoot}/sites/${this.$siteId}/workbooks?overwrite=true`,
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
  }).then(data => {
    console.log('publish workbook:', name, 'ok', `projectId=${projectId}`)
  }).catch(err => {
    console.error('publish workbook:', err.message, name, 'ok', `projectId=${projectId}`)
  })
}

function queryViews (options = {}) {

}

module.exports = {
  queryWorkbooks,
  downloadWorkbook,
  publishWorkbook,
  queryViews
}
