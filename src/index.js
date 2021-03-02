const core = require('@actions/core')
const Harbormaster = require('./lib/harbormaster')
const publish = require('./publish')


async function main() {
  
  const harbormaster = new Harbormaster({
    url: core.getInput('sonar_url'),
    token: await Harbormaster.getServiceAccountToken({
      clientEmail: core.getInput('client_email'),
      privateKey: core.getInput('private_key'),
    }),
  })
  
  publish(harbormaster)  
}

main()
