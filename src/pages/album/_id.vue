<template>
  <div>
    <div v-if="errorMessage">
      {{ errorMessage }}
    </div>
    <div v-else>
      <img :src="albumData.image" class="h-12 w-12">
      <h1>
        {{ albumData.album }}
      </h1>
      <h2>
        {{ albumData.creator }}
      </h2>
      <p>
        {{ albumData.annotation }}
      </p>

      <pre>{{ album }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlbumPage',
  data () {
    return {
      album: [],
      errorMessage: null,
    }
  },
  async mounted () {
    try {
      this.album = await this.$store.dispatch('getAlbum', {
        id: this.$route.params.id,
      })
    } catch (err) {
      console.error(err)
      this.errorMessage = err.message
    }
  },
  computed: {
    albumData () {
      return this.album.length
        ? this.album[0]
        : {}
    },
  },
}
</script>
