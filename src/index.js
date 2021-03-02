const axios = require('axios')
const fs = require('fs')

async function loadGithubEvent(path) {
  return JSON.parse(await fs.promises.readFile(path))
}

;(async () => {
  const sonarUrl = process.env.INPUT_SONAR_URL
  const event = await loadGithubEvent(process.env.GITHUB_EVENT_PATH)

  console.log(sonarUrl)
  console.log(process.env)
  console.log(event)
})()
