const fs = require('fs')
const Client = require('./lib/client')
const core = require("@actions/core");
const { context, GitHub } = require("@actions/github");


async function loadGithubEventFile(path) {
  return JSON.parse(await fs.promises.readFile(path))
}

async function formatSonarCredentials(credentials) {
  return credentials
}

;(async () => {
  // load github event

  // const event = await loadGithubEventFile(process.env.GITHUB_EVENT_PATH)
  // console.log(event)
  // console.log(process.env)
  
  const trigger = core.getInput("trigger", { required: true })
  // const body = context.payload.pull_request.body
  console.log('trigger', trigger)
  // console.log('body', body)
  const client = new GitHub(process.env.GITHUB_TOKEN)

  console.log(process.env)
  console.log('context', context)
  console.log(client)
  // // check if trigger matches
  // if (!event.comment.body.startsWith(process.env.INPUT_TRIGGER)) {
  //   console.log('Comment does not match the trigger, exiting.')
  //   return
  // }

  // // check if circle build is done

  // // create sonar client
  // const client = new Client({
  //   url: process.env.INPUT_SONAR_URL,
  //   credentials: process.env.SONAR_CREDENTIALS,
  // })

  // // validate environment
  // const [, envName = process.env.INPUT_DEFAULT_ENVIRONMENT] = event.comment.body.split(' ').filter(i => !!i)
  // const environment = await client.environments.get({ name: envName })
  
  // if (!environment) {
  //   throw new Error(`Environment ${environment.name} not found`)
  // }


  console.log(fs.readFileSync(`${process.env.GITHUB_WORKSPACE}/.scoop/app.yaml`, 'utf8'))

  // create and POST package

  // post release
})()
