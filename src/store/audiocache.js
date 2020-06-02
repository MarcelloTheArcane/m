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
    REMOVE_CACHE_ITEM (state, location) {
      delete state[location]
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
    runLRU ({ state, rootState, commit }) {
      const toRemove = Object.keys(state)

      // Whitelist every item in the playlist after
      // the current playlist index minus an offset
      rootState.playlist
        .slice(rootState.playingIndex - 3)
        .forEach(item => {
          const indexInToRemove = toRemove.indexOf(item.location)
          if (indexInToRemove !== -1) {
            toRemove.splice(indexInToRemove, 1)
          }
        })
      
      toRemove.forEach(location => commit('REMOVE_CACHE_ITEM', location))
    },
  },
}
