require('dotenv').config()
import axios from 'axios'

const proxy = axios.create({
  baseURL: process.env.VUE_APP_PROXY_URL,
  params: {
    format: 'json',
    num_tracks: 25,
  },
  headers: {
    accept: 'application/json',
  },
})

export default {
  namespaced: true,
  state () {
    return {}
  },
  mutations: {
    ADD_TO_CACHE (state, [ key, value ]) {
      state[key] = value
    },
  },
  actions: {
    async get ({ state, commit }, { path, params }) {
      const cachePath = btoa(path + JSON.stringify(params))
      if (!state[cachePath]) {
        const { data } = await proxy.get(path, { params })
        commit('ADD_TO_CACHE', [ cachePath, data ])
      }

      return state[cachePath]
    },
  },
}
