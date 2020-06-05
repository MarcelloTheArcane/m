<template>
  <div class="flex md:flex-row flex-col colour-theme">
    <progress
      min="0"
      max="1"
      :value="songProgress"
      class="w-full h-1"
      ref="progress"
    />

    <div class="flex flex-row justify-between mx-2 my-1 text-sm">
      <p>
        {{ songTime | minutes }}
      </p>
      <p>
        {{ currentSong.duration | minutes }}
      </p>
    </div>

    <div class="mx-2 flex flex-row lg:flex-1 lg:pl-6 md:pl-3">
      <img v-lazy="song.image" class="w-12 h-12 my-1">
      <div class="mx-2 flex-1 min-w-0">
        <p class="text-sm truncate w-full">
          {{ song.title }}
        </p>
        <p class="text-xs truncate w-full">
          {{ song.album }}
        </p>
        <p class="text-xs truncate w-full">
          {{ song.creator }}
        </p>
      </div>
    </div>

    <div class="w-full flex-1 flex flex-row items-center pb-2 px-2">
      <button
        @click="playPreviousSong"
        class="p-2 focus:outline-none"
        :style="`opacity: ${playDisabled ? 0.6 : 1}`"
      >
        <svg viewBox="0 0 24 24" width="38" height="38" fill="currentColor">
          <polygon points="11 19 2 12 11 5 11 19"></polygon>
          <polygon points="22 19 13 12 22 5 22 19"></polygon>
        </svg>
      </button>

      <button
        @click="togglePlaying"
        class="p-2 focus:outline-none"
        :style="`opacity: ${playDisabled ? 0.6 : 1}`"
      >
        <svg v-if="paused" viewBox="0 0 24 24" width="38" height="38" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <svg v-else viewBox="0 0 24 24" width="38" height="38" fill="currentColor">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      </button>

      <button
        @click="playNextSong"
        class="p-2 focus:outline-none"
        :style="`opacity: ${playDisabled ? 0.6 : 1}`"
      >
        <svg viewBox="0 0 24 24" width="38" height="38" fill="currentColor">
          <polygon points="13 19 22 12 13 5 13 19"></polygon>
          <polygon points="2 19 11 12 2 5 2 19"></polygon>
        </svg>
      </button>

      <span class="flex-1">&nbsp;</span>

      <button
        v-if="$store.getters['favourites/locations'].includes(song.location)"
        @click="$store.dispatch('favourites/delete', song)"
        class="p-2 focus:outline-none"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="currentColor" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </button>
      <button
        v-else
        @click="$store.dispatch('favourites/add', song)"
        class="p-2 focus:outline-none"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </button>

      <a :href="song.location" class="p-2 focus:outline-none" :download="song.title">
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="8 17 12 21 16 17"></polyline>
          <line x1="12" y1="12" x2="12" y2="21"></line>
          <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path>
        </svg>
      </a>
    </div>

    <div class="w-full flex-1" ref="audio">
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
    },
  },
  data () {
    return {
      songProgress: 0,
      songTime: 0,

      paused: true,
      playDisabled: false,
    }
  },
  computed: {
    currentSong () {
      return this.$store.state.audiocache[this.song.location]
    },
  },
  methods: {
    playCurrentSong () {
      const element = this.$store.state.audiocache[this.song.location]
      this.$refs.audio.innerHTML = ''
      this.$refs.audio.appendChild(element)

      element.addEventListener('play', () => {
        this.paused = false
        this.playDisabled = false
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: this.song.title,
          artist: this.song.creator,
          album: this.song.album,
          artwork: [{ src: this.song.image }],
        })
      })

      element.addEventListener('progress', (event) => {
        const audioElement = event.target
        const buffered = (audioElement.buffered.end(0) * 100) / audioElement.duration
        document.documentElement.style
          .setProperty('--progress-buffered', buffered.toFixed(3) + '%')
      })

      element.addEventListener('pause', () => {
        this.paused = true
        this.playDisabled = false
      })

      element.addEventListener('ended', () => {
        this.$store.dispatch('nextSong')
      })

      this.playDisabled = true

      element.play().then(() => {
        this.paused = false
        this.playDisabled = false
        this.updateProgress()
      })
    },
    loadNextSong () {
      const nextSong = this.$store.state.playlist[this.$store.state.playingIndex + 1]
      if (nextSong) {
        this.$store.dispatch('audiocache/preload', nextSong)
      }
    },
    togglePlaying () {
      this.updateProgress()

      if (this.currentSong.paused) {
        this.playDisabled = true
        this.currentSong.play().then(() => {
          this.paused = false
          this.playDisabled = false
          this.updateProgress()
        })
      } else if (!this.playDisabled) {
        this.currentSong.pause()
      }
    },
    playNextSong () {
      if (this.playDisabled) {
        return
      }

      this.resetPlay()
      this.$store.dispatch('nextSong')

      this.playDisabled = true
      this.currentSong.play().then(() => {
        this.paused = false
        this.playDisabled = false
        this.updateProgress()
      })
    },
    playPreviousSong () {
      if (this.playDisabled) {
        return
      }

      if (this.currentSong.currentTime > 5) {
        this.resetPlay()
        this.currentSong.currentTime = 0
        this.currentSong.play()
      } else {
        this.resetPlay()
        this.$store.dispatch('previousSong')
      }
    },
    updateProgress () {
      if (this.song && this.song.location) {
        this.songTime = this.currentSong.currentTime
        this.songProgress = this.currentSong.currentTime / this.currentSong.duration
      }
    },
    resetPlay () {
      this.paused = true
      this.playDisabled = false
      this.songProgress = 0
      this.songTime = 0
    },
  },
  filters: {
    minutes (time) {
      if (!time) {
        return '00:00'
      } else {
        const minutes = Math.floor(time / 60).toString()
        const seconds = Math.floor(time % 60).toString()
        return `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
      }
    },
  },
  watch: {
    song (newSong) {
      if (newSong && newSong.location) {
        this.playDisabled = false
        this.playCurrentSong()
        this.loadNextSong()
      }
    },
  },
  mounted () {
    this.updateProgress()
    setInterval(this.updateProgress, 750)
    this.playCurrentSong()
    this.loadNextSong()


    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        this.playPreviousSong()
      })
  
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        this.playNextSong()
      })
    }
  },
}
</script>

<style scoped>
@media (prefers-color-scheme: light) {
  progress[value]::-webkit-progress-bar {
    background-image: linear-gradient(90deg, #FFFFFF00 0%, #FFFFFF00 var(--progress-buffered), #FFFFFFAA var(--progress-buffered), #FFFFFFAA 100%);
    background-color: var(--colour-bg-light);
  }

  progress[value]::-webkit-progress-value {
    background-color: var(--colour-fg-light);
  }
}

@media (prefers-color-scheme: dark) {
  progress[value]::-webkit-progress-bar {
    background-image: linear-gradient(90deg, #FFFFFF55 0%, #FFFFFF55 var(--progress-buffered), #FFFFFF00 var(--progress-buffered), #FFFFFF00 100%);
    background-color: var(--colour-bg-dark);
  }
  
  progress[value]::-webkit-progress-value {
    background-color: var(--colour-fg-dark);
  }
}
</style>
