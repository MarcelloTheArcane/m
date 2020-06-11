<template>
  <div class="flex flex-col items-center h-full bg-transparent">
    <img
      v-if="$store.getters.nowPlaying"
      v-lazy="$store.getters.nowPlaying.image"
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
    <h2 v-if="$store.getters.nowPlaying" class="text-base text-center px-6">
      Now playing:<br>
      {{ $store.getters.nowPlaying.title }}
    </h2>

    <div class="w-full bg-white rounded-t-lg p-3 mt-5">
      &nbsp;
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
