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
    ADD_FAVOURITE (state, { song, folder }) {
      state.push({
        song,
        folder, 
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
    SET_FOLDER (state, { location, folder }) {
      const newState = state.map((songData) => {
        if (songData.song.location === location) {
          songData.folder = folder
        }
        return songData
      })
      state.splice(0, state.length, ...newState)
      localStorage.setItem(v2StorageKey, JSON.stringify(state))
    },
  },
  actions: {
    add ({ commit }, { song, folder }) {
      commit('ADD_FAVOURITE', { song, folder })
    },
    delete ({ commit }, { location }) {
      commit('DELETE_FAVOURITE', location)
    },
    setFolder ({ commit }, { location, folder }) {
      commit('SET_FOLDER', { location, folder })
    },
    migrate ({ commit }) {
      if (localStorage.getItem(v1StorageKey)) {
        commit('MIGRATE')
      }
    },
  },
  getters: {
    byFolder (state) {
      return state.reduce((final, item) => {
        if (item.folder && final[item.folder]) {
          final[item.folder].push(item)
        } else if (item.folder) {
          final[item.folder] = [item]
        } else {
          final['Uncategorised'].push(item)
        }

        return final
      }, { Uncategorised: [] })
    },
    folders (state) {
      const duplicatedFolders = state.map(item => item.folder || 'Uncategorised')
      const foldersSet = new Set(duplicatedFolders)
      return Array.from(foldersSet)
    },
    locations (state) {
      return state.map(({ song }) => song.location)
    },
  },
}
