import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

const baseURL = 'REDACTED'

const proxy = axios.create({
  baseURL,
  params: {
    format: 'json',
    num_tracks: 25,
  },
  headers: {
    accept: 'application/json',
  },
})

const audioCache = {}

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    playlist: [],
    playingIndex: -1,
    isPlaying: false,
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
    async getNewStationBySearch (_, { type, title }) {
      const { data } = await proxy.get(`/get_new_station_by_search`, {
        params: {
          type,
          title,
        },
      })
      return data.playlist.track
    },
    async getNewStationById (_, { type, id }) {
      const { data } = await proxy.get(`/get_new_station_by_id`, {
        params: {
          type,
          id,
        },
      })
      return data.playlist.track
    },
    async getBySearch (_, { type, title }) {
      const { data } = await proxy.get(`/get_by_search`, {
        params: {
          type,
          title,
        },
      })
      return data.playlist.track
    },
    async getIflStation () {
      const { data } = await proxy.get(`/get_ifl_station`)
      return data.playlist.track
    },
    async getAlbum (_, { id }) {
      const { data } = await proxy.get(`/get_album`, {
        params: {
          id,
        },
      })
      return data.playlist.track
    },
    async getSongInfo (_, { id }) {
      const { data } = await proxy.get(`/get_song_info`, {
        params: {
          id,
        },
      })
      return data
    },
    async getTopTracksArtist (_, { id }) {
      const { data } = await proxy.get(`/get_top_tracks_artist`, {
        params: {
          id,
        },
      })
      return data.playlist.track
    },
    async getAllStations () {
      const { data } = await proxy.get(`/get_all_stations`)
      return data.playlist.track
    },
    async getTopSongs () {
      const { data } = await proxy.get(`/get_top_songs`)
      return data.playlist.track
    },
    async getListenNow () {
      const { data } = await proxy.get('/get_listen_now')
      return data.playlist.track.map(track => ({
        title: track.title,
        station: track.location.match(/\/get_listen_now_list\/(.+)$/)[1],
      }))
    },
    async getListenNowList (_, { station }) {
      const { data } = await proxy.get(`/get_listen_now_list/${station}`)
      return data.playlist.track
    },
    async getDiscographyArtist (_, { id }) {
      const { data } = await proxy.get(`/get_discography_artist`, {
        params: {
          id,
        }
      })
      return data
    },
    async likeSong (_, { id }) {
      await proxy.get(`/like_song`, {
        params: {
          id,
        },
      })
    },
    async dislikeSong (_, { id }) {
      await proxy.get(`/dislike_song`, {
        params: {
          id,
        },
      })
    },

    togglePlaying ({ commit, dispatch, state }) {
      if (state.isPlaying) {
        commit('setIsPlaying', false)
        dispatch('pauseAudio')
      } else {
        commit('setIsPlaying', true)
        dispatch('playAudio')
      }
    },
    async playAudio (_, { url }) {
      if (!audioCache[url]) {
        audioCache[url] = new Audio(url)
        audioCache[url].autoplay = false
        audioCache[url].load()

        audioCache[url].addEventListener('canplaythrough', () => {
          audioCache[url].play()
        })
      } else {
        audioCache[url].play()
      }
    },
    pauseAudio (_, { url }) {
      audioCache[url].pause()
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
  }
})
