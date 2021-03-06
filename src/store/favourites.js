import Vue from 'vue'

const v1StorageKey = 'gmp_favourites_v1'
const v2StorageKey = 'gmp_favourites_v2'
const v3StorageKey = 'gmp_favourites_v3'
// remember to update ./plugins/storeSubscriptions.js

export default {
  namespaced: true,
  state () {
    return localStorage.getItem(v3StorageKey)
      ? JSON.parse(localStorage.getItem(v3StorageKey))
      : {}
  },
  mutations: {
    ADD_FAVOURITE (state, { folder = 'Uncategorised', song }) {
      if (state[folder]) {
        state[folder].push(song)
      } else {
        Vue.set(state, folder, [song])
      }
    },
    DELETE_FAVOURITE (state, { folder, index }) {
      state[folder].splice(index, 1)
      if (state[folder].length === 0) {
        Vue.delete(state, folder)
      }
    },
    MIGRATE (state) {
      const v1Data = JSON.parse(localStorage.getItem(v1StorageKey))
      const v2Data = JSON.parse(localStorage.getItem(v2StorageKey))
      const v3Data = JSON.parse(localStorage.getItem(v3StorageKey))

      if (v1Data && !v2Data) {
        console.info('Migrating v1 data')
        const newData = {
          Uncategorised: v1Data
        }

        localStorage.removeItem(v1StorageKey)
        state.splice(0, state.length, ...newData)
      } else if (v2Data && !v3Data) {
        console.info('Migrating v2 data')
        const newData = v2Data.reduce((final, item) => {
          if (final[item.folder]) {
            final[item.folder].push(item.song)
          } else {
            final[item.folder] = [item.song]
          }

          return final
        }, {})

        localStorage.removeItem(v2StorageKey)
        localStorage.setItem(v3StorageKey, JSON.stringify(newData))
        state = newData
      }
    },
    SET_FOLDER (state, { folder, song }) {
      if (state[folder]) {
        state[folder].push(song)
      } else {
        Vue.set(state, folder, [song])
      }
    },
    MOVE_UP (state, { folder, index }) {
      state[folder].splice(index - 1, 0, ...state[folder].splice(index, 1))
    },
    MOVE_DOWN (state, { folder, index }) {
      state[folder].splice(index + 1, 0, ...state[folder].splice(index, 1))
    },
    RENAME_FOLDER (state, { oldName, newName }) {
      Vue.delete(Object.assign(state, {[newName]: state[oldName] }), oldName)
    },
    MERGE_FOLDER (state, { oldName, newName }) {
      state[newName].push(...state[oldName])
      Vue.delete(state, oldName)
    },
  },
  actions: {
    add ({ commit, dispatch }, { song, folder }) {
      dispatch('tracking/favourite', { type: 'add', song, folder }, { root: true })
      commit('ADD_FAVOURITE', { song, folder })
    },
    delete ({ commit, dispatch }, { folder, index }) {
      dispatch('tracking/favourite', { type: 'delete', song: folder[index] }, { root: true })
      commit('DELETE_FAVOURITE', { folder, index })
    },
    setFolder ({ commit, dispatch }, { song, folder }) {
      dispatch('tracking/favourite', { type: 'setFolder', song, folder }, { root: true })
      commit('SET_FOLDER', { song, folder })
    },
    moveUp ({ commit }, { folder, index }) {
      if (index > 0) {
        commit('MOVE_UP', { folder, index })
      }
    },
    moveDown ({ commit, state }, { folder, index }) {
      if (index < (state[folder].length - 1)) {
        commit('MOVE_DOWN', { folder, index })
      }
    },
    migrate ({ commit }) {
      if (localStorage.getItem(v1StorageKey) || localStorage.getItem(v2StorageKey)) {
        commit('MIGRATE')
      }
    },
    renameFolder ({ commit, dispatch, getters }, { oldName, newName }) {
      if (oldName === newName || newName === '') {
        return
      }

      dispatch('tracking/favourite', { type: 'rename', oldName, newName }, { root: true })

      if (getters.folders.includes(newName)) {
        commit('MERGE_FOLDER', { oldName, newName })
      } else {
        commit('RENAME_FOLDER', { oldName, newName })
      }
    },
  },
  getters: {
    folders (state) {
      return Object.keys(state)
    },
    locations (state) {
      const songListSet = new Set()
      for (const index in state) {
        state[index].forEach(({ location }) => songListSet.add(location))
      }
      return Array.from(songListSet)
    },
  },
}
