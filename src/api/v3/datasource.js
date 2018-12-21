const { createWriteStream, createReadStream, mkdirsSync, existsSync } = require('fs-extra')
const path = require('path')
const AdmZip = require('adm-zip')

const downloadDir = path.resolve(path.parse(require.main.filename).dir, 'downloads')

function queryDataSources (options = {}) {
  return this
    .$request({
      method: 'GET',
      url: 'datasources'
    })
}

function downloadDataSource (datasourceId, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      const dir = options.dir || downloadDir
      if (!existsSync(dir)) mkdirsSync(dir)
      const file = path.resolve(dir, datasourceId + '.tdsx')
      const stream = createWriteStream(file)
      stream.on('finish', () => {
        if (options.extract) {
          const unzip = new AdmZip(file)
          const extractDir = path.resolve(options.extractDir || dir, datasourceId)
          mkdirsSync(extractDir)
          unzip.extractAllTo(extractDir, true)
          resolve()
        } else {
          resolve()
        }
      })
      stream.on('error', err => {
        reject(err)
      })
      this.$request({
        method: 'GET',
        url: `datasources/${datasourceId}/content`
      }).pipe(stream)
    } catch (e) {
      reject(e)
    }
  })
}

function publishDataSource ({ name, projectId, filePath, fileName, connectionCredentials }) {
  const cc = connectionCredentials
  const connectionCredentialsXml = cc
    ? `<connectionCredentials name="${cc.user}" password="${cc.password}" embed="${cc.embed || true}" />`
    : ''
  const xmlString = `<tsRequest>
    <datasource name="${name}">
      ${connectionCredentialsXml}
      <project id="${projectId}" />
    </datasource>
  </tsRequest>`

  return this.$request({
    method: 'POST',
    url: 'datasources?overwrite=true',
    headers: { 'content-type': 'multipart/mixed' },
    multipart: [
      {
        'Content-Disposition': 'name="request_payload"',
        'Content-Type': 'text/xml',
        body: xmlString
      },
      {
        'Content-Disposition': `name="tableau_datasource";filename="${fileName}"`,
        'Content-Type': 'application/octet-stream',
        body: createReadStream(filePath)
      }
    ]
  })
}

function deleteDataSource (datasourceId) {
  return this
    .$request({
      method: 'DELETE',
      url: `datasources/${datasourceId}`
    })
}

module.exports = {
  queryDataSources,
  downloadDataSource,
  publishDataSource,
  deleteDataSource
}
