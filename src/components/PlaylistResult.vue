<template>
  <div class="px-2">
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
  name: 'PlaylistResult',
  components: {
    ContextMenu,
  },
  props: {
    result: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  data () {
    return {
      songData: null,
      loading: false,
      expanded: false,
      folderAddExpanded: false,
      newFolderName: '',
    }
  },
  computed: {
    isCurrentlyPlaying () {
      return this.index === this.$store.state.playingIndex
    },
    contextMenu () {
      return [
        {
          text: 'Play',
          el: 'button',
          vOn: {
            click: () => {
              this.isCurrentlyPlaying ? this.restart() : this.play()
            },
          },
        },
        {
          text: 'Reload',
          el: 'button',
          vOn: {
            click: this.reload,
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
        {
          text: 'Move up',
          el: 'button',
          vOn: {
            click: this.moveUp,
          },
        },
        {
          text: 'Move down',
          el: 'button',
          vOn: {
            click: this.moveDown,
          },
        },
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
    handleSelectLink () {
      this.expanded = false
      this.$emit('select-link')
    },
    handleSelectOption () {
      this.expanded = false
      this.$emit('select-option')
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
      if (this.$store.getters['favourites/locations'].includes(this.result.location)) {
        this.$store.dispatch('favourites/setFolder', {
          folder,
          song: this.result,
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
