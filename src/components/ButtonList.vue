<template>
  <div class="w-full bg-white rounded-t-lg p-3 flex flex-row">
    <span class="flex-1">&nbsp;</span>
    <button
      @click="shareList"
      class="border-gray-500 border text-center text-sm mx-2 py-2 px-3 bg-gray-200 text-gray-800"
      title="Share list"
    >
      Share
    </button>
    <button
      @click="appendQueue"
      class="border-gray-500 border text-center text-sm mx-2 py-2 px-3 bg-gray-200 text-gray-800"
      title="Add to queue"
    >
      Queue
    </button>
    <button
      @click="playNext"
      class="border-gray-500 border text-center text-sm mx-2 py-2 px-3 bg-gray-200 text-gray-800"
      title="Play album next"
    >
      Next
    </button>
    <button
      @click="playAll"
      class="border-gray-500 border text-center text-sm ml-2 py-2 px-3 bg-gray-200 text-gray-800"
      title="Play album"
    >
      Play
    </button>
  </div>
</template>

<script>
export default {
  name: 'ButtonList',
  props: {
    listName: {
      type: String,
      required: false,
      default: 'New Playlist',
    },
    list: {
      type: Array,
      required: true,
    },
  },
  methods: {
    async shareList () {
      const id = await this.$store.dispatch('db/createList', {
        name: this.listName,
        songs: this.list,
      })

      if (navigator.userAgent.match(/android/i)) {
        window.open(`whatsapp://send?text=http%3A%2F%2Fec2-34-247-52-128.eu-west-1.compute.amazonaws.com%3A8080%2F%23%2Flist%2F${id}`, '_blank')
      } else {
        this.$router.push(`/list/${id}`)
      }
    },
    playAll () {
      this.$store.dispatch('setPlaylist', this.list)
    },
    playNext () {
      this.$store.dispatch('setPlayNext', this.list)
    },
    appendQueue () {
      this.$store.dispatch('addToPlaylist', {
        index: this.$store.state.playlist.length,
        newList: this.list,
      })
    },
  },
}
</script>
