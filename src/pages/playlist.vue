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
    <h2 v-if="$store.getters.nowPlaying" class="text-base text-center px-1">
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
      if (!colour) return

      this.themeColour = `#${this.toHex(colour[0])}`

      document.documentElement.style.setProperty('--colour-fg-light', `#${this.toHex(colour[0])}`)
      document.documentElement.style.setProperty('--colour-bg-light', `#${this.toHex(colour[1])}`)
      document.documentElement.style.setProperty('--colour-fg-dark', `#${this.toHex(colour[1])}`)
      document.documentElement.style.setProperty('--colour-bg-dark', `#${this.toHex(colour[0])}`)
    },
  },
  beforeDestroy () {
    const defaultColourOneLight = getComputedStyle(document.documentElement)
      .getPropertyValue('--default-colour-fg-light')
    const defaultColourTwoLight = getComputedStyle(document.documentElement)
      .getPropertyValue('--default-colour-bg-light')
    const defaultColourOneDark = getComputedStyle(document.documentElement)
      .getPropertyValue('--default-colour-fg-dark')
    const defaultColourTwoDark = getComputedStyle(document.documentElement)
      .getPropertyValue('--default-colour-bg-dark')

    document.documentElement.style.setProperty('--colour-fg-light', defaultColourOneLight)
    document.documentElement.style.setProperty('--colour-bg-light', defaultColourTwoLight)
    document.documentElement.style.setProperty('--colour-fg-dark', defaultColourOneDark)
    document.documentElement.style.setProperty('--colour-bg-dark', defaultColourTwoDark)
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
