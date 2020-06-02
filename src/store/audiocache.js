export default {
  namespaced: true,
  state () {
    return {}
  },
  mutations: {
    ADD_TO_CACHE (state, location) {
      state[location] = new Audio()
      state[location].preload = 'none'
      state[location].src = location
      state[location].controls = false
      state[location].style.width = '100%'
    },
    RELOAD_SONG (state, location) {
      state[location].load()
    },
    RESTART_SONG (state, location) {
      state[location].currentTime = 0
    },
  },
  actions: {
    async add ({ state, commit }, { location }) {
      if (!state[location]) {
        commit('ADD_TO_CACHE', location)
      }
    },
    async preload ({ state }, { location }) {
      if (state[location].readyState === 0) {
        state[location].load()
      }
    },
    reload ({ commit }, { location }) {
      commit('RELOAD_SONG', location)
    },
    restart ({ commit }, { location }) {
      commit('RESTART_SONG', location)
    },
  },
}
