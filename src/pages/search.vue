<template>
  <div>
    Search
    <div v-if="errorMessage">
      {{ errorMessage }}
    </div>
    <div v-else>
      <input placeholder="Search..." v-model="query" @keypress.enter="search" />
      <button :disabled="!query.length" @click="search">
        Search
      </button>
      <pre>{{ results }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchPage',
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
