const Harbormaster = require('./lib/harbormaster')

const fs = require('fs')
const core = require('@actions/core')
const { context } = require('@actions/github')
const yaml = require('js-yaml')
const { JWT } = require('google-auth-library')

async function getAccessToken(accountConfigBase64) {
  const serviceKeys = JSON.parse(Buffer.from(accountConfigBase64, 'base64').toString('utf-8'))

  const client = new JWT(
    serviceKeys.client_email,
    null,
    serviceKeys.private_key,
    ['https://www.googleapis.com/auth/cloud-platform'],
  )

  const { token } = await client.getAccessToken()

  return token
}

(async function main() {
  if (!context.payload.comment.body.startsWith(core.getInput('trigger'))) {
    console.log('Comment does not match the trigger, exiting.')
    return
  }

  const harbormaster = new Harbormaster({
    url: core.getInput('sonar_url'),
    token: await getAccessToken(process.env.SONAR_CREDENTIALS),
  })
  
  const [, environmentName = core.getInput('default_environment')] = context.payload.comment.body.split(' ').filter(i => !!i)
  const [environment] = await harbormaster.environments.get({
    name: environmentName
  })
  
  if (!environment) {
    core.setFailed(`Environment ${environment.name} not found`)
    return
  }

  const package = await harbormaster.packages.post({
    appManifest: yaml.load(await fs.promises.readFile(`${process.env.GITHUB_WORKSPACE}/.scoop/app.yaml`, 'utf8')),
    commitTime: context.payload.comment.created_at,
    version: `${core.getInput('ref')}-test`,
    metadata: {
      ciBuildUrl: `${core.getInput('ci_url_prefix')}${context.payload.repository.full_name}`,
      commitUrl: context.payload.issue.pull_request.html_url,
    },
    branch: core.getInput('branch'),
  })

  await harbormaster.releases.post({
    packageId: package.id,
    environmentName,
    type: 'promote',
    overrideWorkflow: true,
  })
})()
