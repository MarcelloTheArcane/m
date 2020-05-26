<template>
  <div class="mx-2">
    <div class="flex flex-row items-center" @click="toggleExpanded">
      <img :src="result.image" class="w-16 h-16">
      <div class="ml-2 border-t border-gray-500 px-1 py-5 h-full min-w-0 w-full">
        <p class="text-sm text-gray-800 truncate">
          {{ result.title }}
        </p>
        <p class="text-xs text-gray-600">
          {{ result.creator }}
        </p>
      </div>
    </div>
    <div v-if="expanded" class="mb-2 flex justify-around">
      <button @click="play">
        Play
      </button>
      <button @click="playNext">
        Play next
      </button>
      <router-link :to="`/artist/${songData.artistId[0]}`">
        Artist
      </router-link>
      <router-link :to="`/album/${songData.albumId}`">
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
    }
  },
  methods: {
    async toggleExpanded () {
      if (!this.songData) {
        const id = this.result.location.slice(-27)
        this.songData = await this.$store.dispatch('getSongInfo', { id })
      }

      this.expanded = !this.expanded
    },
    play () {
      this.$store.commit('setPlayNow', [this.result])
    },
    playNext () {
      this.$store.commit('setPlayNext', [this.result])
    },
  },
}
</script>
