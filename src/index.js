const Client = require('./lib/client')

const fs = require('fs')
const core = require('@actions/core')
const { context } = require('@actions/github')
const yaml = require('js-yaml')
const { JWT } = require('google-auth-library')

async function getAccessToken(accountConfig) {
  const serviceKeys = JSON.parse(Buffer.from(accountConfig, 'base64').toString('utf-8'))

  const client = new JWT(
    serviceKeys.client_email,
    null,
    serviceKeys.private_key,
    ['https://www.googleapis.com/auth/cloud-platform'],
  )

  const { token } = await client.getAccessToken()

  return token
}

;(async () => {
  if (!context.payload.comment.body.startsWith(core.getInput('trigger', { required: true }))) {
    console.log('Comment does not match the trigger, exiting.')
    return
  }

  // create sonar client
  const client = new Client({
    url: core.getInput('sonar_url'),
    token: await getAccessToken(process.env.SONAR_CREDENTIALS),
  })
  
  // validate environment
  const [, environmentName = core.getInput('default_environment')] = context.payload.comment.body.split(' ').filter(i => !!i)
  const [environment] = await client.environments.get({ name: environmentName })
  
  if (!environment) {
    throw new Error(`Environment ${environment.name} not found`)
  }

  // POST package
  const package = await client.packages.post({
    appManifest: yaml.load(await fs.promises.readFile(`${process.env.GITHUB_WORKSPACE}/.scoop/app.yaml`, 'utf8')),
    commitTime: context.payload.comment.created_at,
    version: `${core.getInput('ref')}-test`,
    metadata: {
      ciBuildUrl: `${core.getInput('default_ci_url_prefix')}${context.payload.repository.full_name}`,
      commitUrl: context.payload.issue.pull_request.html_url,
    },
    branch: core.getInput('branch'),
  })

  // POST release
  await client.releases.post({
    packageId: package.id,
    environmentName,
    type: 'promote',
    overrideWorkflow: true,
  })
})()
