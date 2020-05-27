import Vue from 'vue'
import Vuex from 'vuex'

import cache from './cache.js'
import audiocache from './audiocache.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state () {
    return {
      playlist: [],
      playingIndex: -1,
      isPlaying: false,
    }
  },
  mutations: {
    SET_PLAYLIST (state, newList) {
      state.playlist.splice(0, state.playlist.length, ...newList)
      state.playingIndex = 0
    },
    SET_PLAYLIST_INDEX (state, newIndex) {
      state.playingIndex = newIndex
    },
    SET_PLAY_NOW (state, newList) {
      state.playlist.splice(state.playingIndex + 1, 0, ...newList)
      state.playingIndex = state.playingIndex + 1
    },
    SET_PLAY_NEXT (state, newList) {
      state.playlist.splice(state.playingIndex + 1, 0, ...newList)
    },
    ADD_TO_PLAYLIST ({ playlist }, { newList, index }) {
      playlist.splice(index, 0, ...newList)
    },
    REMOVE_FROM_PLAYLIST (state, index) {
      state.playlist.splice(index, 1)
      if (index < state.playingIndex) {
        state.playingIndex = state.playingIndex - 1
      }
    },
    NEXT_SONG (state) {
      state.playingIndex = state.playingIndex + 1
    },
    PREVIOUS_SONG (state) {
      state.playingIndex = state.playingIndex - 1
    },
  },
  actions: {
    async getNewStationBySearch ({ dispatch }, { type, title }) {
      const { data } = await dispatch('cache/get', {
        path: `/get_new_station_by_search`,
        params: {
          type,
          title,
        },
      })

      data.playlist.track
        .forEach(track => dispatch('audiocache/add', track.location))

      return data.playlist.track
    },
    async getNewStationById ({ dispatch }, { type, id }) {
      const data = await dispatch('cache/get', {
        path: `/get_new_station_by_id`,
        params: {
          type,
          id,
        },
      })

      data.playlist.track
        .forEach(track => dispatch('audiocache/add', track.location))

      return data.playlist.track
    },
    async getBySearch ({ dispatch }, { type, title }) {
      const data = await dispatch('cache/get', {
        path: `/get_by_search`,
        params: {
          type,
          title,
        },
      }, { root: true })

      data.playlist.track
        .forEach(track => dispatch('audiocache/add', track.location))

      return data.playlist.track
    },
    async getIflStation ({ dispatch }) {
      const data = await dispatch('cache/get', {
        path: `/get_ifl_station`,
      }, { root: true })

      data.playlist.track
        .forEach(track => dispatch('audiocache/add', track.location))

      return data.playlist.track
    },
    async getAlbum ({ dispatch }, { id }) {
      const data = await dispatch('cache/get', {
        path: `/get_album`,
        params: {
          id,
        },
      }, { root: true })

      data.playlist.track
        .forEach(track => dispatch('audiocache/add', track.location))

      return data.playlist.track
    },
    async getSongInfo ({ dispatch }, { id }) {
      const data = await dispatch('cache/get', {
        path: `/get_song_info`,
        params: {
          id,
        },
      }, { root: true })

      return data
    },
    async getTopTracksArtist ({ dispatch }, { id }) {
      const data = await dispatch('cache/get', {
        path: `/get_top_tracks_artist`,
        params: {
          id,
        },
      })

      data.playlist.track
        .forEach(track => dispatch('audiocache/add', track.location))

      return data.playlist.track
    },
    async getAllStations ({ dispatch }) {
      const data = await dispatch('cache/get', {
        path: `/get_all_stations`,
      }, { root: true })

      data.playlist.track
        .forEach(track => dispatch('audiocache/add', track.location))

      return data.playlist.track
    },
    async getTopSongs ({ dispatch }) {
      const data = await dispatch('cache/get', {
        path: `/get_top_songs`,
      }, { root: true })

      data.playlist.track
        .forEach(track => dispatch('audiocache/add', track.location))

      return data.playlist.track
    },
    async getListenNow ({ dispatch }) {
      const data = await dispatch('cache/get', {
        path: '/get_listen_now',
      }, { root: true })

      return data.playlist.track.map(track => ({
        title: track.title,
        station: track.location.match(/\/get_listen_now_list\/(.+)$/)[1],
      }))
    },
    async getListenNowList ({ dispatch }, { station }) {
      const data = await dispatch('cache/get', {
        path: `/get_listen_now_list/${station}`,
      }, { root: true })

      data.playlist.track
        .forEach(track => dispatch('audiocache/add', track.location))

      return data.playlist.track
    },
    async getDiscographyArtist ({ dispatch }, { id }) {
      const data = await dispatch('cache/get', {
        path: `/get_discography_artist`,
        params: {
          id,
        }
      }, { root: true })

      return data
    },
    // async likeSong (_, { id }) {
    //   await proxy.get(`/like_song`, {
    //     params: {
    //       id,
    //     },
    //   })
    // },
    // async dislikeSong (_, { id }) {
    //   await proxy.get(`/dislike_song`, {
    //     params: {
    //       id,
    //     },
    //   })
    // },
    setPlayNow ({ commit }, { newList }) {
      commit('SET_PLAY_NOW', newList)
    },
    setPlayNext ({ commit, dispatch }, { newList }) {
      commit('SET_PLAY_NEXT', newList)
      dispatch('audiocache/preload', newList[0])
    },
    nextSong ({ commit, dispatch, getters, state }) {
      if (getters.hasNextSong) {
        commit('NEXT_SONG')
        const nextSong = state.playlist[state.playingIndex + 1]
        dispatch('audiocache/preload', nextSong)
      }
    },
    previousSong ({ commit }) {
      commit('PREVIOUS_SONG')
    },
    setPlaylist ({ commit }, newList) {
      commit('SET_PLAYLIST', newList)
      dispatch('audiocache/preload', newList[0])
    },
    setPlaylistIndex ({ commit }, index) {
      commit('SET_PLAYLIST_INDEX', index)
      const nextSong = state.playlist[index + 1]
      if (nextSong) {
        dispatch('audiocache/preload', nextSong)
      }
    },
    addToPlaylist ({ commit }, newList) {
      commit('ADD_TO_PLAYLIST', newList)
      dispatch('audiocache/preload', newList[0])
    },
    removeFromPlaylist ({ commit }, index) {
      commit('REMOVE_FROM_PLAYLIST', index)
    },
  },
  getters: {
    hasNextSong ({ playlist, playingIndex }) {
      return playlist.length < (playingIndex + 1)
    },
    hasPreviousSong ({ playingIndex }) {
      return playingIndex > 0
    },
    nowPlaying ({ playlist, playingIndex }) {
      return playlist[playingIndex]
    },
  },
  modules: {
    cache,
    audiocache,
  }
})
