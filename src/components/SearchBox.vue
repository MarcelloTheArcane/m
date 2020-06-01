<template>
  <div class="bg-transparent p-2">
    <div v-if="!showingSearch" class="flex flex-row">
      <a 
        v-if="$route.fullPath !== '/'"
        @click="$router.go(-1)"
        class="focus:outline-none"
      >
        <svg
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
      </a>

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
    <div v-else>
      <label :class="{
        'rounded-t-lg': results.length || errorMessage || searching,
        'rounded-lg': !(results.length || errorMessage || searching),
        'flex flex-row w-full text-gray-800 bg-white px-3 inline-block': true,
      }">
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

      <div v-if="errorMessage" class="text-center text-red-600 bg-white p-2 rounded-b-lg shadow-md">
        {{ errorMessage }}
      </div>
      <div v-else-if="noResults" class="text-center text-gray-800 bg-white p-2 rounded-b-lg shadow-md">
        No results
      </div>
      <div v-else-if="searching" class="text-center rounded-b-lg p-2 bg-white shadow-md text-gray-800">
        Loading...
      </div>
      <div v-else-if="results.length" class="h-8/12 bg-white py-2 rounded-b-lg overflow-y-auto shadow-md">
        <song-result
          v-for="(result, index) in results"
          :key="index"
          :result="result"
          @select-option="clearSearch"
        />
      </div>
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
      noResults: false,
      query: '',
      results: [],
      errorMessage: '',
      searching: false,
    }
  },
  methods: {
    async search () {
      if (!this.query.length) {
        return
      }

      this.noResults = false
      this.searching = true
      try {
        this.results = await this.$store.dispatch('getBySearch', {
          type: 'matches',
          title: this.query,
        })

        if (this.results.length === 0) {
          this.noResults = true
        }
      } catch (err) {
        console.error(err)
        this.errorMessage = err.message
      }
      this.searching = false
    },
    clearSearch () {
      this.showingSearch = false
      this.noResults = false
      this.errorMessage = ''
      this.query = ''
      this.results = []
    },
  },
}
</script>

<style scoped>
.h-8\/12 {
  max-height: 66.666vh;
}
</style>
