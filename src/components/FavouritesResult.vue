<template>
  <div class="px-2">
    <div class="flex flex-row items-center">
      <img v-lazy="result.image" class="w-16 h-16">
      <div :class="{
        'font-bold': isCurrentlyPlaying,
        'ml-2 border-t border-gray-500 px-1 py-5 h-full min-w-0 w-full': true
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
    <context-menu
      v-if="expanded"
      scroll-id="pagebox"
      :toggle-dimensions="$refs.toggle.getBoundingClientRect()"
      :options="contextMenu"
      class="absolute right-0 bg-white shadow-lg border border-gray-200 p-2 mt-1 mr-12 rounded z-20"
    />
    <context-menu
      v-if="folderAddExpanded"
      scroll-id="pagebox"
      :toggle-dimensions="$refs.toggle.getBoundingClientRect()"
      :options="folderContextMenu"
      class="absolute right-0 bg-white shadow-lg border border-gray-200 p-2 mt-1 mr-12 rounded z-20"
    >
      <input
        placeholder="New folder..."
        v-model="newFolderName"
        class="block w-full px-2 py-2 text-left text-gray-800 bg-transparent"
        @keypress.enter="addSongToFolder(newFolderName)"
      >
    </context-menu>
  </div>
</template>

<script>
import ContextMenu from './ContextMenu'

export default {
  name: 'FavouritesResult',
  components: {
    ContextMenu,
  },
  props: {
    folder: {
      type: String,
      required: false,
      default: 'Uncategorised',
    },
    id: {
      type: Number,
      required: true,
    },
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
    contextMenu () {
      return [
        {
          text: 'Play',
          el: 'button',
          vOn: {
            click: this.play,
          },
        },
        {
          text: 'Play next',
          el: 'button',
          vOn: {
            click: this.playNext,
          },
        },
        {
          text: 'Queue',
          el: 'button',
          vOn: {
            click: this.queue,
          },
        },
        {
          text: 'Remove',
          el: 'button',
          vOn: {
            click: this.remove,
          },
        },
        {
          text: 'Artist',
          el: 'router-link',
          to: `/artist/${this.songData.artistId[0]}`,
          vOn: {
            click: this.handleSelectOption,
          },
        },
        {
          text: 'Album',
          el: 'router-link',
          to: `/album/${this.songData.albumId}`,
          vOn: {
            click: this.handleSelectOption,
          },
        },
        {
          text: 'Station',
          el: 'router-link',
          to: `/station/${this.songData.nid}/${this.songData.title}`,
          vOn: {
            click: this.handleSelectOption,
          },
        },
        {
          text: 'Share',
          el: 'button',
          vOn: {
            click: this.shareSong,
          },
        },
        ... this.id !== 0 ? [{
          text: 'Move up',
          el: 'button',
          vOn: {
            click: () => {
              this.$store.dispatch('favourites/moveUp', {
                folder: this.folder,
                index: this.id,
              })

              this.handleSelectOption()
            },
          },
        }] : [],
        ... this.id !== this.$store.state.favourites[this.folder].length - 1 ? [{
          text: 'Move down',
          el: 'button',
          vOn: {
            click: () => {
              this.$store.dispatch('favourites/moveDown', {
                folder: this.folder,
                index: this.id,
              })

              this.handleSelectOption()
            },
          },
        }] : [],
        {
          text: 'Add to folder',
          el: 'button',
          vOn: {
            click: this.startFolderAdd,
          },
        },
      ]
    },
    folderContextMenu () {
      return [
        ...this.$store.getters['favourites/folders'].map(folder => ({
          text: folder,
          el: 'button',
          vOn: {
            click: () => {
              this.addSongToFolder(folder)
            },
          },
        })),
      ]
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
          this.expanded = false
        } else {
          this.expanded = true
        }

      } catch (err) {
        console.error(err)
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
    remove () {
      this.handleSelectOption()
      this.$store.dispatch('favourites/delete', {
        folder: this.folder,
        index: this.id,
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
    async shareSong () {
      const id = await this.$store.dispatch('db/createList', {
        name: this.songData.title,
        songs: [this.result],
      })

      if (navigator.userAgent.match(/android/i)) {
        window.open(`whatsapp://send?text=http%3A%2F%2Fec2-34-247-52-128.eu-west-1.compute.amazonaws.com%3A8080%2F%23%2Flist%2F${id}`, '_blank')
      } else {
        this.$router.push(`/list/${id}`)
      }
    },
    startFolderAdd () {
      this.expanded = false
      this.folderAddExpanded = true
    },
    addSongToFolder (folder) {
      this.$store.dispatch('favourites/setFolder', {
        folder,
        song: this.result,
      })
      this.newFolderName = ''
      this.folderAddExpanded = false
    },
  },
}
</script>
