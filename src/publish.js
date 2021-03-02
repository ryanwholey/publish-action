const fs = require('fs')
const core = require('@actions/core')
const { context } = require('@actions/github')
const yaml = require('js-yaml')

async function publish(harbormaster) {
  if (!context.payload.comment.body.startsWith(core.getInput('trigger'))) {
    core.info('Comment does not match the trigger, exiting.')
    return
  }

  const [, environmentName = core.getInput('default_environment')] = context.payload.comment.body.split(' ').filter(i => !!i)

  let environment
  try {
    ([environment] = await harbormaster.environments.get({ name: environmentName }))
  } catch (err) {
    return core.setFailed({ url: err.response.config.url, ...err.response.data })
  }
  
  if (!environment) {
    return core.setFailed(`Environment ${environment.name} not found`)
  }

  try {
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
      package: { id: package.id },
      environment: { name: environmentName },
      type: 'promote',
    })

    core.info('Successfully released')

  } catch (err) {
    return core.setFailed({ url: err.response.config.url, ...err.response.data })
  }
}

module.exports = publish
