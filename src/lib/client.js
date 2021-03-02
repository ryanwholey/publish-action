'use strict'

const axios = require('axios')

class Client {
  constructor({ url, credentials }) {
    this.url = url
    this.credentials = credentials
  }

  environments = {
    get: async ({ name }) => {
      console.log({ name })
      return [{ name }]
      const environments = await axios({
        url:`${this.url}/environments`,
        headers: {
          Authorization: `Bearer ${this.credentials}`,
        }
      })
      return name ? environments.data.find((env) => env.name === name) : environments.data
    },
  }

  packages = {
    post: async (props) => {
      console.log(props)
    },
  }

  releases = {
    post: async () => {
      console.log(this.url)
    },
  }
}

module.exports = Client
