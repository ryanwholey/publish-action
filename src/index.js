const fs = require('fs')
const Client = require('./lib/client')
const core = require('@actions/core')
const { context } = require('@actions/github')
const yaml = require('js-yaml')

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
  const [, environmentName = core.getInput('default_environment')] = context.payload.comment.body.split(' ').filter(i => !!i)
  const environment = await client.environments.get({ name: environmentName })
  
  if (!environment) {
    throw new Error(`Environment ${environment.name} not found`)
  }

  console.log(context.payload.issue.pull_request)

  // POST package
  const package = await client.packages.post({
    appManifest: yaml.load(fs.readFileSync(`${process.env.GITHUB_WORKSPACE}/.scoop/app.yaml`, 'utf8')),
    commitTime: context.payload.comment.created_at,
    version: `${core.getInput('ref')}-test`,
    metadata: {
      ciBuildUrl: `${core.getInput('default_ci_url_prefix')}/${context.payload.repository.full_name}`,
      commitUrl: context.payload.issue.html_url,
    }
  })

  // POST release
  await client.releases.post({
    packageId: package.id,
    environmentName,
    type: 'promote',
    overrideWorkflow: true,
  })
})()
