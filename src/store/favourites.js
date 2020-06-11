const v1StorageKey = 'gmp_favourites_v1'
const v2StorageKey = 'gmp_favourites_v2'

export default {
  namespaced: true,
  state () {
    return localStorage.getItem(v2StorageKey)
      ? JSON.parse(localStorage.getItem(v2StorageKey))
      : []
  },
  mutations: {
    ADD_FAVOURITE (state, data) {
      state.push({
        song: data,
      })

      localStorage.setItem(v2StorageKey, JSON.stringify(state))
    },
    DELETE_FAVOURITE (state, location) {
      const newState = state.filter(({ song }) => song.location !== location)
      state.splice(0, state.length, ...newState)
      localStorage.setItem(v2StorageKey, JSON.stringify(state))
    },
    MIGRATE (state) {
      const v1Data = JSON.parse(localStorage.getItem(v1StorageKey))
      const v2Data = v1Data.map(song => {
        return {
          song,
        }
      })
      localStorage.setItem(v2StorageKey, JSON.stringify(v2Data))
      localStorage.removeItem(v1StorageKey)

      state.splice(0, state.length, ...v2Data)
    },
  },
  actions: {
    add ({ commit }, data) {
      commit('ADD_FAVOURITE', data)
    },
    delete ({ commit }, { location }) {
      commit('DELETE_FAVOURITE', location)
    },
    migrate ({ commit }) {
      if (localStorage.getItem(v1StorageKey)) {
        commit('MIGRATE')
      }
    },
  },
  getters: {
    locations (state) {
      return state.map(({ song }) => song.location)
    },
  },
}
