<template>
  <div class="bg-gray-200 p-2">
    <div v-if="!showingSearch" class="flex flex-row">
      <router-link to="/" class="focus:outline-none">
        <svg
          v-if="$route.fullPath !== '/'"
          class="m-2"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </router-link>

      <span class="flex-1">
        &nbsp;
      </span>

      <router-link to="/playlist" class="focus:outline-none">
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="m-2">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </router-link>

      <svg
        @click="showingSearch = true"
        class="m-2"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </div>

    <label
      v-else
      class="flex flex-row w-full text-gray-800 bg-white rounded-full px-3 inline-block"
    >
      <button @click="clearSearch" class="inline focus:outline-none">
        <svg
          class="inline"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <input
        id="search"
        v-model="query"
        type="text"
        class="flex-1 bg-transparent focus:outline-none p-2 block"
        placeholder="Search"
        @keypress.enter="search"
      >
    </label>

    <div class="h-8/12 bg-white my-2 p-1 rounded overflow-y-auto shadow-md" v-if="results">
      <song-result
        v-for="(result, index) in results"
        :key="index"
        :result="result"
        @select-option="clearSearch"
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
      showingSearch: false,
      query: '',
      results: null,
      errorMessage: null,
    }
  },
  methods: {
    async search () {
      if (!this.query.length) {
        return
      }

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
    clearSearch () {
      this.showingSearch = false
      this.errorMessage = null
      this.query = ''
      this.results = null
    },
  },
}
</script>

<style scoped>
.h-8\/12 {
  max-height: 66.666vh;
}
</style>
