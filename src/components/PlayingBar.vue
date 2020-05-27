<template>
  <div class="p-2" style="background-color: #f1f3f4;">
    <div class="flex flex-row" v-if="song.location">
      <img v-lazy="song.image" class="w-12 h-12 my-1">
      <div class="mx-2 flex-1 min-w-0">
        <p class="text-sm text-gray-800 truncate w-full">
          {{ song.title }}
        </p>
        <p class="text-xs text-gray-600 truncate w-full">
          {{ song.album }}
        </p>
        <p class="text-xs text-gray-600 truncate w-full">
          {{ song.creator }}
        </p>
      </div>
    </div>
    <div ref="audio">
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlayingBar',
  props: {
    song: {
      type: Object,
      required: false,
      default () {
        return {}
      },
    },
  },
  data () {
    return {
      nextSong: null,
    }
  },
  methods: {
    playCurrentSong () {
      const element = this.$store.state.audiocache[this.song.location]
      this.$refs.audio.innerHTML = ''
      this.$refs.audio.appendChild(element)
      element.play()
      element.addEventListener('ended', () => {
        this.$store.dispatch('nextSong')
      })
    },
    loadNextSong () {
      const nextSong = this.$store.state.playlist[this.$store.state.playingIndex + 1]
      if (nextSong) {
        this.$store.dispatch('audiocache/preload', nextSong)
      }
    },
  },
  watch: {
    song (newSong) {
      if (newSong.location) {
        this.playCurrentSong()
        this.loadNextSong()
      }
    },
  },
  mounted () {
    if (this.song.location) {
      this.playCurrentSong()
      this.loadNextSong()
    }
  },
}
</script>

