'use strict'

const axios = require('axios')
const { JWT } = require('google-auth-library')

class Client {

  constructor({ url, token }) {
    this.url = url
    this.token = token
  }

  static async getServiceAccountToken({
    clientEmail,
    privateKey,
  }) {
    const client = new JWT(
      clientEmail,
      null,
      privateKey,
      ['https://www.googleapis.com/auth/cloud-platform'],
    )
  
    return (await client.getAccessToken()).token
  }

  environments = {
    get: async ({ name }) => {
      const environments = await axios({
        url:`${this.url}/environments`,
        headers: { Authorization: `Bearer ${this.token}` },
      })
      
      return name ? [environments.data.find((env) => env.name === name)] : environments.data
    }
  }

  packages = {
    post: async (props) => (await axios({
      url: `${this.url}/packages?appName=${props.appManifest.app.name}`,
      headers: { Authorization: `Bearer ${this.token}` },
      method: 'post',
      data: props,
    })).data
  }

  releases = {
    post: async (props) => (await axios({
      url:`${this.url}/releases`,
      headers: { Authorization: `Bearer ${this.token}` },
      method: 'post',
      data: props,
    })).data
  }
}

module.exports = Client
