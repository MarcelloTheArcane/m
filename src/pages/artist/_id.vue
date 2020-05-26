<template>
  <div>
    <div v-if="errorMessage">
      {{ errorMessage }}
    </div>
    <div v-else>
      <song-result
        v-for="(result, index) in results"
        :key="index"
        :result="result"
      />
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
      results: null,
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
}
</script>
