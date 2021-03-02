const fs = require('fs')
const Client = require('./lib/client')
const core = require('@actions/core')
const { context } = require('@actions/github')

async function formatSonarCredentials(credentials) {
  return credentials
}

;(async () => {
  if (!context.payload.comment.body.startsWith(core.getInput('trigger', { required: true }))) {
    console.log('Comment does not match the trigger, exiting.')
    return
  }

  // check if circle build is done

  // // create sonar client
  const client = new Client({
    url: core.getInput('sonar_url', { required: true }),
    credentials: process.env.SONAR_CREDENTIALS,
  })
  
  // validate environment
  const [, envName = core.getInput('default_environment')] = context.payload.comment.body.split(' ').filter(i => !!i)
  const environment = await client.environments.get({ name: envName })
  
  if (!environment) {
    throw new Error(`Environment ${environment.name} not found`)
  }

  console.log(process.env.GITHUB_SHA)
  console.log(core.getInput('ref'))

  // POST package
  const package = await client.packages.post({
    appManifest: yaml.load(fs.readFileSync(`${process.env.GITHUB_WORKSPACE}/.scoop/app.yaml`, 'utf8')),
    commitTime: '2016-02-23T07:23:07.192Z',
    version: `${core.getInput('pull_request_ref')}-test`,
    metadata: {
      ciBuildUrl: `${core.getInput('default_ci_url_prefix')}/${context.payload.repository.name}`,
      commitUrl: context.payload.issue.html_url,
    }
  })

  // POST release
})()
