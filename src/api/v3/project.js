function createProject ({ name }) {
  return this
    .$request({
      method: 'POST',
      url: 'projects',
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
      url: 'projects'
    })
    .then(data => {
      return data.projects.project
    })
}

module.exports = {
  createProject,
  queryProjects
}
