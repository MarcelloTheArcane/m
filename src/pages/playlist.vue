<template>
  <div class="h-full bg-transparent">
    <div class="flex h-full flex-col items-center relative">
      <img
        v-if="$store.getters.nowPlaying"
        :src="$store.getters.nowPlaying.image"
        class="h-32 w-32 m-5 rounded"
        ref="image"
        @load="getColour"
      >
      <img
        v-else
        src="@/assets/defaultimage.png"
        class="h-32 w-32 m-5 rounded"
      >

      <h1 class="text-lg text-center">
        Playlist
      </h1>
      <h2 v-if="$store.getters.nowPlaying" class="text-base text-center px-6 mb-4">
        Now playing:<br>
        {{ $store.getters.nowPlaying.title }}
      </h2>

      <div class="w-full bg-white rounded-t-lg p-3 flex flex-row">
        <span class="flex-1">&nbsp;</span>
        <button
          v-if="$store.state.playlist.length !== 0"
          @click="$store.dispatch('clearPlaylist')"
          class="border-gray-500 border text-center text-sm ml-2 py-2 px-3 bg-gray-200 text-gray-800"
          title="Clear playlist"
        >
          Clear
        </button>
      </div>

      <div class="w-full flex-1 bg-white">
        <playlist-result
          v-for="(result, index) in $store.state.playlist"
          :key="index"
          :result="result"
          :index="index"
        />

        <p
          v-if="$store.state.playlist.length === 0"
          class="text-center text-gray-800"
        >
          Your playlist is empty
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import PlaylistResult from '@/components/PlaylistResult.vue'

export default {
  name: 'ThePlaylist',
  components: {
    PlaylistResult,
  },
  data () {
    return {
      themeColour: '#EDF2F7',
    }
  },
  methods: {
    getColour () {
      if (!this.$store.getters.nowPlaying.image) return

      const image = this.$refs.image
      image.crossOrigin = 'Anonymous'
      this.$store.dispatch('colourcache/load', {
        image,
        url: this.$store.getters.nowPlaying.image,
      })

      this.themeColour = this.$store.dispatch('colourcache/getTheme', {
        image,
        url: this.$store.getters.nowPlaying.image,
      })
    },
  },
  beforeDestroy () {
    this.$store.dispatch('colourcache/unload')
  },
  metaInfo () {
    return {
      title: this.$store.getters.nowPlaying
        ? this.$store.getters.nowPlaying.title
        : 'Playlist',
      meta: [
        { name: 'theme-color', content: this.themeColour, vmid: 'theme' },
      ],
    }
  },
}
</script>
