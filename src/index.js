const core = require('@actions/core')
const Harbormaster = require('./lib/harbormaster')
const publish = require('./publish')

async function main() {
  const {
    client_email: clientEmail,
    private_key: privateKey,
  } = JSON.parse(Buffer.from(process.env.SONAR_CREDENTIALS, 'base64').toString('utf-8'))

  core.setSecret(privateKey)
  console.log(process.env.JSON_SONAR_CREDENTIALS)
  try {
    JSON.parse(process.env.JSON_SONAR_CREDENTIALS)
  } catch  (err) {
    console.error(err)
  }
  const harbormaster = new Harbormaster({
    url: core.getInput('sonar_url'),
    token: await Harbormaster.getServiceAccountToken({ clientEmail, privateKey }),
  })

  await publish(harbormaster)  
}

main()
