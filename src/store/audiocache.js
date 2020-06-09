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
    },
    RELOAD_SONG (state, location) {
      state[location] = new Audio()
      state[location].preload = 'auto'
      state[location].src = location
      state[location].controls = false
      state[location].load()
    },
    RESTART_SONG (state, location) {
      state[location].currentTime = 0
    },
    REMOVE_CACHE_ITEM (state, location) {
      delete state[location]
    },
    CLEAR_CACHE (state) {
      for(const item in state) {
        delete state[item]
      }
    },
  },
  actions: {
    async add ({ state, commit }, { location }) {
      if (!state[location]) {
        commit('ADD_TO_CACHE', location)
      }
    },
    async preload ({ state, dispatch }, song) {
      const { location } = song

      if (!state[location]) {
        dispatch('add', song)
      }

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
    runLRU ({ commit, state, rootState }) {
      const toRemove = Object.keys(state)

      const keepInPlaylist = rootState.playlist
        .slice(Math.max(0, rootState.playingIndex - 3))
        .map(({ location }) => location)
      
      toRemove
        .filter(location => keepInPlaylist.includes(location) === false)
        .forEach(item => commit('ADD_TO_CACHE', item)) // 'ADD_TO_CACHE' will overwrite with unloaded audio element
    },
    clearCache ({ commit }) {
      commit('CLEAR_CACHE')
    },
    removeCacheItem ({ commit }, { location }) {
      commit('REMOVE_CACHE_ITEM', location)
    },
  },
}
