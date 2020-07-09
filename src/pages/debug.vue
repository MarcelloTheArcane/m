<template>
  <div>
    <p>
      Playing index: {{ $store.state.playingIndex }}
    </p>
    <p>
      Playlist length: {{ $store.state.playlist.length }}
    </p>
    <p>
      Proxy version: {{ version }}
    </p>

    <p>
      <button @click="showingStore = !showingStore">
        Toggle store state
      </button>
      <pre v-if="showingStore">{{ $store.state }}</pre>
    </p>
    <p>
      <button @click="showingPlaylist = !showingPlaylist">
        Toggle playlist
      </button>
      <pre v-if="showingPlaylist">{{ $store.state.playlist }}</pre>
    </p>
    <div>
      <button @click="showingAudioCache = !showingAudioCache">
        Toggle audiocache
      </button>
      <div v-if="showingAudioCache">
        <p v-for="location in Object.keys($store.state.audiocache)" :key="location">
          <pre>{{ location }}</pre>
          <pre>{{ $store.state.audiocache[location].readyState | audioReadyState }}</pre>
        </p>
      </div>
    </div>
    <p>
      <button @click="showingFavourites = !showingFavourites">
        Toggle favourites
      </button>
      <pre v-if="showingFavourites">{{ $store.state.favourites }}</pre>
    </p>
    <p>
      <button @click="showingOldFavourites = !showingOldFavourites">
        Toggle old favourites
      </button>
      <pre v-if="showingOldFavourites">{{ oldFavourites }}</pre>
    </p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'DebugPage',
  data () {
    return {
      showingStore: false,
      showingPlaylist: false,
      showingFavourites: false,
      showingOldFavourites: false,
      showingAudioCache: false,
      version: 'Loading...',
    }
  },
  filters: {
    audioReadyState (state) {
      return {
        0: 'Have nothing',
        1: 'Have metadata',
        2: 'Have current data',
        3: 'Have future data',
        4: 'Have enough data',
      }[state] || 'Unknown state: ' + state
    },
  },
  computed: {
    oldFavourites () {
      return `
v1:
${ JSON.stringify(JSON.parse(localStorage.getItem('gmp_favourites_v1')), null, 2) }

v2:
${ JSON.stringify(JSON.parse(localStorage.getItem('gmp_favourites_v2')), null, 2) }

v3:
${ JSON.stringify(JSON.parse(localStorage.getItem('gmp_favourites_v3')), null, 2) }
      `
    }
  },
  async mounted () {
    const { data } = await axios.get(`${process.env.VUE_APP_PROXY_URL}/get_version`)
    this.version = data.version
  },
}
</script>
