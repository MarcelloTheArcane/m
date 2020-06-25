<template>
  <div class="px-2">
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
      <button @click="toggleExpanded" ref="toggle" class="focus:outline-none p-3 text-gray-800">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="12" cy="5" r="1"></circle>
          <circle cx="12" cy="19" r="1"></circle>
        </svg>
      </button>
    </div>
    <div v-if="expanded" ref="menu" class="absolute right-0 bg-white shadow-lg border border-gray-200 p-2 mt-1 mr-12 rounded z-20">
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
      <button
        @click="queue"
        class="block w-full px-2 py-2 text-left text-gray-800"
      >
        Queue
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
      <router-link
        @click.native="handleSelectLink()"
        :to="`/station/${songData.nid}/${songData.title}`"
        class="block w-full px-2 py-2 text-left text-gray-800"
      >
        Station
      </router-link>
      <a
        :href="`whatsapp://send?text=${this.songData.title}, from http%3A%2F%2Fec2-34-247-52-128.eu-west-1.compute.amazonaws.com%3A8080%2F%23%2Falbum%2F${this.songData.albumId}`"
        class="block w-full px-2 py-2 text-left text-gray-800"
      >
        Share
      </a>
      <button
        @click="startFolderAdd"
        class="block w-full px-2 py-2 text-left text-gray-800"
      >
        Add to folder
      </button>
    </div>
    <div v-if="folderAddExpanded" class="absolute right-0 bg-white shadow-lg border border-gray-200 p-2 mt-1 mr-12 rounded z-20">
      <button
        v-for="(folder, index) in $store.getters['favourites/folders']"
        :key="index"
        class="block w-full px-2 py-2 text-left text-gray-800 select-none"
        @click="addSongToFolder(folder)"
      >
        {{ folder }}
      </button>
      <input
        placeholder="New folder..."
        v-model="newFolderName"
        class="block w-full px-2 py-2 text-left text-gray-800"
        @keypress.enter="addSongToFolder(newFolderName)"
      >
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
    scrollId: {
      type: String,
      required: true
    },
  },
  data () {
    return {
      songData: null,
      expanded: false,
      loading: false,
      folderAddExpanded: false,
      newFolderName: '',
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
          const id = this.result.location.slice(-27)
          this.songData = await this.$store.dispatch('getSongInfo', { id })
        }

        if (this.folderAddExpanded) {
          this.folderAddExpanded = false
        } else if (this.expanded) {
          this.$refs.menu.style.top = ''
          this.expanded = false
        } else {
          this.expanded = true
          await this.$nextTick()
          this.positionMenu()
        }

      } catch (err) {
        console.error(err)
      }
    },
    positionMenu () {
      const scrollbox = document.getElementById(this.scrollId)
      
      const toggle = this.$refs.toggle
      const menu = this.$refs.menu
      const scrollboxDimensions = scrollbox.getBoundingClientRect()
      const toggleDimensions = toggle.getBoundingClientRect()
      const menuDimensions = menu.getBoundingClientRect()
      const maxHeight = Math.min(window.innerHeight, scrollboxDimensions.bottom)

      this.scrollbox = scrollbox
      this.scrollboxDimensions = scrollboxDimensions
      this.toggleDimensions = toggleDimensions
      this.window = window

      const topWithinBounds = toggleDimensions.top + menuDimensions.height < maxHeight
      const bottomWithinBounds = toggleDimensions.bottom + menuDimensions.height < maxHeight

      if (topWithinBounds && bottomWithinBounds) {
        const bottom = maxHeight - scrollbox.scrollTop - toggleDimensions.bottom + 4
        menu.style.bottom = `${bottom}px`
      } else {
        const top = scrollbox.scrollTop + toggleDimensions.top - scrollboxDimensions.top - 4
        menu.style.top = `${top}px`
      }
    },
    play () {
      this.handleSelectOption()
      this.$store.dispatch('setPlayNow', [this.result])
    },
    playNext () {
      this.handleSelectOption()
      this.$store.dispatch('setPlayNext', [this.result])
    },
    queue () {
      this.handleSelectOption()
      this.$store.dispatch('addToPlaylist', {
        index: this.$store.state.playlist.length,
        newList: [this.result],
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
    startFolderAdd () {
      this.expanded = false
      this.folderAddExpanded = true
    },
    addSongToFolder (folder) {
      if (this.$store.getters['favourites/locations'].includes(this.result.location)) {
        this.$store.dispatch('favourites/setFolder', {
          location: this.result.location,
          folder,
        })
      } else {
        this.$store.dispatch('favourites/add', {
          song: this.result,
          folder,
        })
      }
      this.newFolderName = ''
      this.folderAddExpanded = false
    },
  },
}
</script>
