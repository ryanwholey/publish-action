'use strict'

const axios = require('axios')

class Client {

  constructor({ url, token }) {
    this.url = url
    this.token = token
  }

  environments = {
    get: async ({ name }) => {
      return [{ name }]
      const environments = await axios({
        url:`${this.url}/environments`,
        headers: { Authorization: `Bearer ${this.credentials}` },
      })
      return name ? [environments.data.find((env) => env.name === name)] : environments.data
    },
  }

  packages = {
    post: async (props) => {
      console.log(props)
      return {id: '12345'}
      return await axios({
        url:`${this.url}/packages`,
        headers: { Authorization: `Bearer ${this.credentials}` },
        method: 'post',
        body: props,
      })
    }
  }

  releases = {
    post: async (props) => {
      console.log(props)
      return {}
      return await axios({
        url:`${this.url}/releases`,
        headers: { Authorization: `Bearer ${this.credentials}` },
        method: 'post',
        body: props,
      })
    }
  }
}

module.exports = Client
