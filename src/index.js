const axios = require('axios')
const fs = require('fs')

async function loadGithubEvent(path) {
  return await fs.promises.readFile(path)
}

;(async () => {
  const event = await loadGithubEvent(process.env.GITHUB_EVENT_PATH)

  console.log(event.comment)
  console.log(process.env)
})()
