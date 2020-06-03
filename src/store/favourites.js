const storageKey = 'gmp_favourites_v1'

export default {
  namespaced: true,
  state () {
    return localStorage.getItem(storageKey)
      ? JSON.parse(localStorage.getItem(storageKey))
      : []
  },
  mutations: {
    ADD_FAVOURITE (state, data) {
      state.push(data)
      localStorage.setItem(storageKey, JSON.stringify(state))
    },
    DELETE_FAVOURITE (state, location) {
      const newState = state.filter(song => song.location !== location)
      state.splice(0, state.length, ...newState)
      localStorage.setItem(storageKey, JSON.stringify(state))
    },
  },
  actions: {
    add ({ commit }, data) {
      commit('ADD_FAVOURITE', data)
    },
    delete ({ commit }, { location }) {
      commit('DELETE_FAVOURITE', location)
    },
  },
  getters: {
    locations (state) {
      return state.map(({ location }) => location)
    },
  },
}
