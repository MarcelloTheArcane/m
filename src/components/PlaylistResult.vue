<template>
  <div class="px-2 relative">
    <div class="flex flex-row items-center">
      <img v-lazy="result.image" class="w-16 h-16">
      <div
        :class="{
          'font-bold': isCurrentlyPlaying,
          'ml-2 border-t border-gray-500 px-1 py-5 h-full min-w-0 w-full': true,
        }"
      >
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
    <div v-if="loading"  class="absolute top-0 right-0 bg-white shadow-lg border border-gray-200 p-2 pr-5 mt-1 mr-12 rounded z-20">
      Loading...
    </div>
    <div v-if="expanded" class="absolute top-0 right-0 bg-white shadow-lg border border-gray-200 p-2 mt-1 mr-12 rounded z-20">
      <button
        v-if="isCurrentlyPlaying"
        @click="restart" 
        class="block w-full px-2 py-2 text-left text-gray-800"
      >
        Play
      </button>
      <button
        v-else
        @click="play" 
        class="block w-full px-2 py-2 text-left text-gray-800"
      >
        Play
      </button>
      <button
        @click="reload" 
        class="block w-full px-2 py-2 text-left text-gray-800"
      >
        Reload
      </button>
      <button
        @click="remove" 
        class="block w-full px-2 py-2 text-left text-gray-800"
      >
        Remove
      </button>
      <router-link
        @click.native="handleSelectOption()"
        :to="`/artist/${songData.artistId[0]}`" 
        class="block w-full px-2 py-2 text-left text-gray-800"
      >
        Artist
      </router-link>
      <router-link
        @click.native="handleSelectOption()"
        :to="`/album/${songData.albumId}`" 
        class="block w-full px-2 py-2 text-left text-gray-800"
      >
        Album
      </router-link>
      <a 
        :href="`whatsapp://send?text=${this.songData.title}, from http%3A%2F%2Fec2-34-247-52-128.eu-west-1.compute.amazonaws.com%3A8080%2F%23%2Falbum%2F${this.songData.albumId}`"
        class="block w-full px-2 py-2 text-left text-gray-800"
      >
        Share
      </a>
      <button
        v-if="index !== 0"
        @click="moveUp"
        class="block w-full px-2 py-2 text-left text-gray-800"
      >
        Move up
      </button>
      <button
        v-if="index !== $store.state.playlist.length - 1"
        @click="moveDown"
        class="block w-full px-2 py-2 text-left text-gray-800"
      >
        Move down
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
    index: {
      type: Number,
      required: true,
    }
  },
  data () {
    return {
      songData: null,
      loading: false,
      expanded: false,
    }
  },
  computed: {
    isCurrentlyPlaying () {
      return this.index === this.$store.state.playingIndex
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
      this.$store.dispatch('setPlaylistIndex', this.index)
    },
    reload () {
      this.handleSelectOption()
      this.$store.dispatch('audiocache/reload', this.result)
    },
    restart () {
      this.handleSelectOption()
      this.$store.dispatch('audiocache/restart', this.result)
    },
    remove () {
      this.handleSelectOption()
      this.$store.dispatch('removeFromPlaylist', this.index)
    },
    moveUp () {
      this.handleSelectOption()
      this.$store.dispatch('moveSongUp', this.index)
    },
    moveDown () {
      this.handleSelectOption()
      this.$store.dispatch('moveSongDown', this.index)
    },
    handleSelectOption () {
      this.expanded = false
      this.$emit('select-option')
    },
  },
}
</script>
