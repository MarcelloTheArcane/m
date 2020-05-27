export default {
  namespaced: true,
  state () {
    return {}
  },
  mutations: {
    addToCache (state, location) {
      state[location] = new Audio()
      state[location].preload = 'none'
      state[location].src = location
      state[location].controls = true
      state[location].style.width = '100%'
    },
  },
  actions: {
    async add ({ state, commit }, location) {
      if (!state[location]) {
        commit('addToCache', location)
      }
    },
    async preload ({ state }, { location }) {
      if (state[location].readyState === 0) {
        state[location].load()
      }
    },
  },
}
