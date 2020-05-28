<template>
  <div class="bg-gray-200">
    <div v-if="errorMessage">
      {{ errorMessage }}
    </div>
    <div v-else class="flex flex-col items-center">
      <img v-lazy="albumData.image" class="h-32 w-32 m-5 rounded">
      <h1 class="text-lg text-gray-800 text-center">
        {{ albumData.album }}
      </h1>
      <h2 class="text-sm text-gray-600 text-center">
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
      errorMessage: null,
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
