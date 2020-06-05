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
    <p>
      <button @click="showingFavourites = !showingFavourites">
        Toggle favourites
      </button>
      <pre v-if="showingFavourites">{{ $store.state.favourites }}</pre>
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
      version: 'Loading...'
    }
  },
  async mounted () {
    const { data } = await axios.get(`${process.env.VUE_APP_PROXY_URL}/get_version`)
    this.version = data.version
  },
}
</script>
