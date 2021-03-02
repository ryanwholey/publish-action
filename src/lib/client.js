'use strict'

const axios = require('axios')

class Client {
  constructor({ url, token }) {
    this.url = url
    this.token = token
  }

  environments = {
    get: async ({ name }) => {
      console.log({
        url:`${this.url}/environments`,
        headers: {
          Authorization: `Bearer ${this.credentials}`,
        }
      })
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
      return {
        id: '12345',
      }
    },
  }

  releases = {
    post: async () => {
      console.log(this.url)
    },
  }
}

module.exports = Client
