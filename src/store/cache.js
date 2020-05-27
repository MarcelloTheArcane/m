import axios from 'axios'

const baseURL = 'http://ec2-34-247-52-128.eu-west-1.compute.amazonaws.com:9999'

const proxy = axios.create({
  baseURL,
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
    addToCache (state, [ key, value ]) {
      state[key] = value
    },
  },
  actions: {
    async get ({ state, commit }, { path, params }) {
      const cachePath = btoa(path + JSON.stringify(params))
      if (!state[cachePath]) {
        const { data } = await proxy.get(path, { params })
        commit('addToCache', [ cachePath, data ])
      }

      return state[cachePath]
    },
  },
}