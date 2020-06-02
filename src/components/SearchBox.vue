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
      <router-link v-if="$route.fullPath !== '/'"
        to="/"
        class="focus:outline-none block"
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
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
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
        @click="showSearch"
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

    <!-- Showing search -->
    <div v-else>
      <label class="rounded-t-lg flex flex-row w-full text-gray-800 bg-white px-3 inline-block">
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
          ref="search"
          autocomplete="disabled"
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

      <div v-else-if="searching" class="text-center rounded-b-lg p-2 bg-white shadow-md text-gray-800">
        Loading...
      </div>

      <div v-else-if="!query.length" class="text-gray-800 bg-white px-4 py-2 rounded-b-lg shadow-md">
        <pre class="bg-gray-200 code">Song name</pre><br />
        <pre class="bg-gray-200 code">Song name exact:yes</pre><br />
        <pre class="bg-gray-200 code">Song name artist:[Artist name]</pre><br />
        <pre class="bg-gray-200 code">Song name artist:[Artist name] exact:yes</pre><br />
        <pre class="bg-gray-200 code">Album name type:album</pre><br />
      </div>

      <div v-else-if="query !== oldQuery" class="text-gray-800 bg-white px-4 py-2 rounded-b-lg shadow-md">
        <p>
          <span v-show="searchTerms.artist" class="bg-gray-200 code">
            artist:{{ searchTerms.artist }}
          </span>
          <span v-show="searchTerms.type === 'artist'" class="bg-gray-200 code">
            artist:{{ searchTerms.title }}
          </span>
          <span v-show="searchTerms.type" class="bg-gray-200 code">
            type:{{ searchTerms.type }}
          </span>
          <span v-show="searchTerms.exact" class="bg-gray-200 code">
            exact:{{ searchTerms.exact }}
          </span>
        </p>
      </div>

      <div v-else-if="results.length" class="h-8/12 bg-white py-2 rounded-b-lg overflow-y-auto shadow-md">
        <song-result
          v-for="(result, index) in results"
          :key="index"
          :result="result"
          @select-link="clearSearch"
        />
      </div>

      <div v-else-if="noResults" class="text-center text-gray-800 bg-white p-2 rounded-b-lg shadow-md">
        No results
      </div>
    </div>
  </div>
</template>

<script>
import SongResult from '@/components/SongResult.vue'

export default {
  name: 'SearchBox',
  components: {
    SongResult,
  },
  data () {
    return {
      showingSearch: false,
      noResults: false,
      query: '',
      oldQuery: '',
      results: [],
      errorMessage: '',
      searching: false,
    }
  },
  computed: {
    searchTerms () {
      let title = this.query
      const type = this.query.match(/(?:^| )type:(matches|artist|album|song)(?:$| )/)
      const artist = this.query.match(/(?:^| )artist:\[(.+?)](?:$| )/)
      const exact = this.query.match(/(?:^| )exact:(yes|no)(?:$| )/)

      const terms = {
        type: 'matches',
        exact: 'no',
      }

      if (exact) {
        terms.exact = exact[1]
        title = title.replace(/exact:(yes|no)/g, '')
      }

      if (artist) {
        terms.artist = artist[1]
        title = title.replace(/artist:\[(.+?)]/g, '')
      }

      if (type) {
        terms.type = type[1]
        title = title.replace(/type:(matches|artist|album|song)/g, '')
      }

      terms.title = title.replace(/\s+/g, ' ').trim()

      return terms
    },
  },
  methods: {
    showSearch () {
      this.clearSearch()
      this.showingSearch = true
    },
    async search () {
      if (!this.query.length) {
        return
      }

      this.oldQuery = this.query
      this.$refs.search.blur()
      this.searching = true

      try {
        this.results = await this.$store.dispatch('getBySearch', this.searchTerms)

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
      this.query = ''
      this.results = []
      this.errorMessage = ''
    },
  },
}
</script>

<style scoped>
.code {
  @apply rounded;
  @apply my-1;
  @apply mx-1;
  @apply px-1;
  @apply inline-block;
  @apply font-mono;
  @apply whitespace-pre-wrap;
}

.h-8\/12 {
  max-height: 66.666vh;
}
</style>
