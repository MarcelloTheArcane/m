<template>
  <div class="flex flex-col items-center h-full bg-transparent">
    <img
      v-if="$store.getters.nowPlaying.image"
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
import ColourThief from 'colorthief/dist/color-thief.mjs'

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
    toHex (colourArray) {
      return colourArray
        .map(value => value.toString(16).padStart(2, '0'))
        .join('')
    },
    getColour () {
      if (!this.$store.getters.nowPlaying.image) return

      const colourThief = new ColourThief()
      const img = this.$refs.image
      img.crossOrigin = 'Anonymous'

      const colour = colourThief.getPalette(img, 2)

      this.themeColour = #${this.toHex(colour[0])}`

      document.documentElement.style.setProperty('--colour-one', `#${this.toHex(colour[0])}`)
      document.documentElement.style.setProperty('--colour-two', `#${this.toHex(colour[1])}`)
    },
  },
  beforeDestroy () {
    const defaultColourOne = getComputedStyle(document.documentElement)
      .getPropertyValue('--default-colour-one')
    const defaultColourTwo = getComputedStyle(document.documentElement)
      .getPropertyValue('--default-colour-two')

    document.documentElement.style.setProperty('--colour-one', defaultColourOne)
    document.documentElement.style.setProperty('--colour-two', defaultColourTwo)
  },
  metaInfo () {
    return {
      title: this.$store.getters.nowPlaying
        ? this.$store.getters.nowPlaying.title
        :'Playlist',
      meta: [
        { name: 'theme-color', description: this.themeColour },
      ],
    }
  },
}
</script>

<style scoped>
  
</style>
