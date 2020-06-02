<template>
  <div class="mx-2">
    <div class="flex flex-row items-center" @click="toggleExpanded">
      <img v-lazy="result.image" class="w-16 h-16">
      <div class="ml-2 border-t border-gray-500 px-1 py-5 h-full min-w-0 w-full">
        <p class="text-sm text-gray-800 truncate">
          {{ result.title }}
        </p>
        <p class="text-xs text-gray-600">
          {{ result.creator }}
        </p>
      </div>
    </div>
    <div v-if="loading" class="mb-2 flex justify-around text-gray-800">
      Loading...
    </div>
    <div v-if="expanded" class="mb-2 flex justify-around">
      <button
        @click="play" 
        class="flex-1 border-gray-500 border text-center mx-2 py-2 bg-gray-200 text-gray-800"
      >
        Play
      </button>
      <button
        @click="playNext" 
        class="flex-1 border-gray-500 border text-center mx-2 py-2 bg-gray-200 text-gray-800"
      >
        Play next
      </button>
      <router-link
        @click.native="handleSelectLink()"
        :to="`/artist/${songData.artistId[0]}`" 
        class="flex-1 border-gray-500 border text-center mx-2 py-2 bg-gray-200 text-gray-800"
      >
        Artist
      </router-link>
      <router-link
        @click.native="handleSelectLink()"
        :to="`/album/${songData.albumId}`" 
        class="flex-1 border-gray-500 border text-center mx-2 py-2 bg-gray-200 text-gray-800"
      >
        Album
      </router-link>
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
    }
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
