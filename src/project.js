function createProject ({ name }) {
  return this
    .$request({
      method: 'POST',
      url: `${this.$apiRoot}/sites/${this.$siteId}/projects`,
      body: {
        project: {
          name
        }
      }
    })
    .then(data => {
      return data.project
    })
}

function queryProjects (options) {
  return this
    .$request({
      method: 'GET',
      url: `${this.$apiRoot}/sites/${this.$siteId}/projects`
    })
    .then(data => {
      return data.projects.project
    })
}

module.exports = {
  createProject,
  queryProjects
}
