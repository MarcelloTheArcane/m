<template>
  <div class="bg-transparent">
    <div v-if="errorMessage" class="text-center text-red-600">
      {{ errorMessage }}
    </div>
    <div v-else class="flex flex-col items-center h-full relative">
      <img
        :src="albumData.image"
        class="h-32 w-32 m-5 rounded"
        crossorigin="Anonymous"
        @load="$store.dispatch('colourcache/load')"
      >
      <h1 class="text-lg text-center px-6">
        {{ albumData.album }}
      </h1>
      <h2 class="text-lg text-center px-6">
        {{ albumData.creator }}
      </h2>

      <button-list
        :list="results"
        :list-name="albumData.album"
        class="mt-5"
      />

      <div class="w-full flex-1 bg-white">
        <song-result
          v-for="(result, index) in results"
          :key="index"
          :result="result"
          scroll-id="pagebox"
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
  beforeDestroy () {
    this.$store.dispatch('colourcache/unload')
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
