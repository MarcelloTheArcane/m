<template>
  <div class="bg-transparent">
    <div v-if="errorMessage" class="text-center text-red-600">
      {{ errorMessage }}
    </div>
    <div v-else class="flex flex-col items-center h-full">
      <img
        v-lazy="albumData.image"
        ref="image"
        class="h-32 w-32 m-5 rounded"
        @load="getColour"
      >
      <h1 class="text-lg text-center">
        {{ albumData.album }}
      </h1>
      <h2 class="text-sm text-center">
        {{ albumData.creator }}
      </h2>

      <button-list
        @play-all="playAll"
        @play-next="playNext"
        @append-queue="appendQueue"
      />

      <div class="w-full flex-1 bg-white">
        <song-result
          v-for="(result, index) in results"
          :key="index"
          :result="result"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ColourThief from 'colorthief/dist/color-thief.mjs'

import SongResult from '@/components/SongResult.vue'
import ButtonList from '@/components/ButtonList.vue'

export default {
  name: 'AlbumPage',
  components: {
    SongResult,
    ButtonList,
  },
  data () {
    return {
      results: [],
      errorMessage: '',
    }
  },
  async mounted () {
    try {
      this.results = await this.$store.dispatch('getAlbum', {
        id: this.$route.params.id,
      })
    } catch (err) {
      console.error(err)
      this.errorMessage = err.message
    }
  },
  computed: {
    albumData () {
      return this.results.length
        ? this.results[0]
        : {}
    },
  },
  methods: {
    playAll () {
      this.$store.dispatch('setPlaylist', this.results)
    },
    playNext () {
      this.$store.dispatch('setPlayNext', this.results)
    },
    appendQueue () {
      this.$store.dispatch('addToPlaylist', {
        index: this.$store.state.playlist.length,
        newList: this.results,
      })
    },
    toHex (colourArray) {
      return colourArray
        .map(value => value.toString(16).padStart(2, '0'))
        .join('')
    },
    getColour () {
      const colourThief = new ColourThief()
      const img = this.$refs.image
      img.crossOrigin = 'Anonymous'

      const colour = colourThief.getPalette(img, 2)

      console.log(`#${this.toHex(colour[0])}`, `#${this.toHex(colour[1])}`)

      document.documentElement.style.setProperty('--colour-one', `#${this.toHex(colour[0])}`)
      document.documentElement.style.setProperty('--colour-two', `#${this.toHex(colour[1])}`)
    },
  },
  beforeDestroy () {
    const defaultColourOne = document.documentElement.style
      .getPropertyValue('--default-colour-one')
    const defaultColourTwo = document.documentElement.style
      .getPropertyValue('--default-colour-two')

    document.documentElement.style.setProperty('--colour-one', defaultColourOne)
    document.documentElement.style.setProperty('--colour-two', defaultColourTwo)
  },
  metaInfo () {
    return {
      title: this.albumData.album
        ? `${this.albumData.album} | ${this.albumData.creator}`
        : 'Loading...',
    }
  },
}
</script>
