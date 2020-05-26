<template>
  <div>
    <div v-if="errorMessage">
      {{ errorMessage }}
    </div>
    <div v-else>
      <input placeholder="Search..." v-model="query" @keypress.enter="search" />
      <button :disabled="!query.length" @click="search">
        Search
      </button>

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
  name: 'SearchPage',
  components: {
    SongResult,
  },
  data () {
    return {
      query: '',
      results: null,
      errorMessage: null,
    }
  },
  methods: {
    async search () {
      try {
        this.results = await this.$store.dispatch('getBySearch', {
          type: 'matches',
          title: this.query,
        })
      } catch (err) {
        console.error(err)
        this.errorMessage = err.message
      }
    },
  },
}
</script>
