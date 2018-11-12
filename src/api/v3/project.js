function createProject (project) {
  return this
    .$request({
      method: 'POST',
      url: 'projects',
      body: {
        project
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
}

module.exports = {
  createProject,
  queryProjects
}
