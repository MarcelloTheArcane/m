import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'

import cache from './cache.js'

// const baseURL = 'REDACTED'

// const proxy = axios.create({
//   baseURL,
//   params: {
//     format: 'json',
//     num_tracks: 25,
//   },
//   headers: {
//     accept: 'application/json',
//   },
// })

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
    setPlaylist (state, newList) {
      state.playlist.splice(0, state.playlist.length, ...newList)
      state.playingIndex = 0
    },
    setPlayNow (state, newList) {
      state.playlist.splice(state.playingIndex + 1, 0, ...newList)
      state.playingIndex = state.playingIndex + 1
    },
    setPlayNext (state, newList) {
      state.playlist.splice(state.playingIndex + 1, 0, ...newList)
    },
    addToPlaylist ({ playlist }, { newList, index }) {
      playlist.splice(index, 0, ...newList)
    },
    nextSong (state) {
      state.playingIndex = state.playingIndex + 1
    },
    previousSong (state) {
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
      return data.playlist.track
    },
    async getIflStation ({ dispatch }) {
      const data = await dispatch('cache/get', {
        path: `/get_ifl_station`,
      }, { root: true })
      return data.playlist.track
    },
    async getAlbum ({ dispatch }, { id }) {
      const data = await dispatch('cache/get', {
        path: `/get_album`,
        params: {
          id,
        },
      }, { root: true })
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

      return data.playlist.track
    },
    async getAllStations ({ dispatch }) {
      const data = await dispatch('cache/get', {
        path: `/get_all_stations`,
      }, { root: true })

      return data.playlist.track
    },
    async getTopSongs ({ dispatch }) {
      const data = await dispatch('cache/get', {
        path: `/get_top_songs`,
      }, { root: true })

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
  }
})
