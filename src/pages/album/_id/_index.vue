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
      <h1 class="text-lg text-center px-6">
        {{ albumData.album }}
      </h1>
      <h2 class="text-lg text-center px-6">
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
      themeColour: '#EDF2F7',
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

    const image = this.$refs.image
    image.crossOrigin = 'Anonymous'

    this.themeColour = this.$store.dispatch('colourcache/getTheme', {
      image,
      path: this.albumData.image,
    })
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
    getColour () {
      const image = this.$refs.image
      image.crossOrigin = 'Anonymous'
      this.$store.dispatch('colourcache/load', {
        image,
        url: this.albumData.image,
      })
    },
  },
  beforeDestroy () {
    this.$store.dispatch('colourcache/unload')
  },
  metaInfo () {
    return {
      title: this.albumData.album
        ? `${this.albumData.album} | ${this.albumData.creator}`
        : 'Loading...',
      meta: [
        { name: 'theme-color', content: this.themeColour, vmid: 'theme' },
      ],
    }
  },
}
</script>
