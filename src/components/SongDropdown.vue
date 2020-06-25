<template>
  <div>
    <slot name="toggle" @click="toggleExpanded">
    </slot>
    <div
      v-if="expanded"
      class="absolute bg-white shadow-lg border border-gray-200 p-2 mt-1 mr-12 rounded z-20"
      ref="container"
    >
      <slot>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SongDropdown',
  data () {
    return {
      loading: false,
      expanded: false,
      songData: null,
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
    },
  },
  mounted () {
    console.log('beforeMount')
    this.$refs.container.style.visibility = 'hidden'
  },
  beforeDestroy () {

  },
}
</script>
