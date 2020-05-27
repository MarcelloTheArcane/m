<template>
  <div class="bg-gray-200">
    <div v-if="errorMessage">
      {{ errorMessage }}
    </div>
    <div v-else class="flex flex-col items-center">
      <img v-lazy="artistData.image" class="h-32 w-32 m-5 rounded">
      <h1 class="text-lg text-gray-800">
        {{ artistData.creator }}
      </h1>

      <div class="w-full bg-white rounded-t-lg p-3 mt-5">
        <button @click="playAll" class="float-right focus:outline-none">
          <svg viewBox="0 0 24 24" width="32" height="32" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" fill="#e2e8f0"></circle>
            <polygon points="10 8 16 12 10 16 10 8"  stroke="currentColor" stroke-width="2"></polygon>
          </svg>
        </button>
      </div>

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

export default {
  name: 'AlbumPage',
  components: {
    SongResult,
  },
  data () {
    return {
      results: [],
      errorMessage: null,
    }
  },
  async mounted () {
    try {
      this.results = await this.$store.dispatch('getTopTracksArtist', {
        id: this.$route.params.id,
        type: 'artist',
      })
    } catch (err) {
      console.error(err)
      this.errorMessage = err.message
    }
  },
  computed: {
    artistData () {
      return this.results.length
        ? this.results[0]
        : {}
    },
  },
  methods: {
    playAll () {
      this.$store.commit('setPlaylist', this.results)
    },
  },
}
</script>
