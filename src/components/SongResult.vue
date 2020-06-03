<template>
  <div :class="{
    'bg-yellow-300': highlightIndex,
    'px-2 relative': true,
  }">
    <div class="flex flex-row items-center">
      <img v-lazy="result.image" class="w-16 h-16">
      <div :class="{
        'font-bold': isCurrentlyPlaying,
        'ml-2 border-t border-gray-500 px-1 py-5 h-full min-w-0 w-full': true,
      }">
        <p class="text-sm text-gray-800 truncate">
          {{ result.title }}
        </p>
        <p class="text-xs text-gray-600">
          {{ result.creator }}
        </p>
      </div>
      <button @click="toggleExpanded" class="focus:outline-none p-3 text-gray-800">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="12" cy="5" r="1"></circle>
          <circle cx="12" cy="19" r="1"></circle>
        </svg>
      </button>
    </div>
    <div v-if="loading" class="absolute top-0 right-0 bg-white shadow-lg border border-gray-200 p-2 pr-5 mt-1 mr-12 rounded z-20">
      Loading...
    </div>
    <div v-if="expanded" class="absolute top-0 right-0 bg-white shadow-lg border border-gray-200 p-2 mt-1 mr-12 rounded z-20">
      <button
        @click="play"
        class="block w-full px-2 py-2 text-left text-gray-800"
      >
        Play
      </button>
      <button
        @click="playNext" 
        class="block w-full px-2 py-2 text-left text-gray-800"
      >
        Play next
      </button>
      <router-link
        @click.native="handleSelectLink()"
        :to="`/artist/${songData.artistId[0]}`" 
        class="block w-full px-2 py-2 text-left text-gray-800"
      >
        Artist
      </router-link>
      <router-link
        @click.native="handleSelectLink()"
        :to="`/album/${songData.albumId}`" 
        class="block w-full px-2 py-2 text-left text-gray-800"
      >
        Album
      </router-link>
      <button 
        v-if="canShare"
        @click="shareSong"
        class="block w-full px-2 py-2 text-left text-gray-800"
      >
        Share
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SongResult',
  props: {
    result: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      songData: null,
      expanded: false,
      loading: false,
      highlightIndex: this.$route.params.index
        ? this.result.trackNum === parseInt(this.$route.params.index)
        : false,
      canShare: !!navigator.share,
    }
  },
  computed: {
    isCurrentlyPlaying () {
      if (!(this.result && this.$store.getters.nowPlaying)) {
        return false
      }

      return this.result.location === this.$store.getters.nowPlaying.location
    },
  },
  methods: {
    async toggleExpanded () {
      try {
        if (!this.songData) {
          this.loading = true
          const id = this.result.location.slice(-27)
          this.songData = await this.$store.dispatch('getSongInfo', { id })
        }
  
        this.expanded = !this.expanded
      } catch (err) {
        console.error(err)
      }

      this.loading = false
    },
    play () {
      this.handleSelectOption()
      this.$store.dispatch('setPlayNow', [this.result])
    },
    playNext () {
      this.handleSelectOption()
      this.$store.dispatch('setPlayNext', [this.result])
    },
    shareSong () {
      this.handleSelectOption()
      navigator.share({
        title: this.songData.title,
        url: `http://ec2-34-247-52-128.eu-west-1.compute.amazonaws.com:8080/#/album/${this.songData.albumId}/${this.songData.trackNumber}`
      })
    },
    handleSelectOption () {
      this.expanded = false
      this.$emit('select-option')
    },
    handleSelectLink () {
      this.expanded = false
      this.$emit('select-link')
    },
  },
}
</script>
