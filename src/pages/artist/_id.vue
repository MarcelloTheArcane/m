<template>
  <div>
    Artist {{ $route.params.id }}
    <div v-if="errorMessage">
      {{ errorMessage }}
    </div>
    <div v-else>
      <pre>{{ result }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlbumPage',
  data () {
    return {
      result: null,
      errorMessage: null,
    }
  },
  async mounted () {
    try {
      this.result = await this.$store.dispatch('getTopTracksArtist', {
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
