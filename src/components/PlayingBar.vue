<template>
  <div
    class="flex flex-col playing-bar"
    ref="playingBar"
  >
    <progress
      min="0"
      max="1"
      :value="songProgress"
      class="w-full h-1"
      ref="progress"
    />

    <div class="flex flex-row justify-between px-2 py-1 text-sm w-full">
      <p>
        {{ songTime | minutes }}
      </p>
      <p>
        {{ currentSong.duration | minutes }}
      </p>
    </div>

    <div class="flex md:flex-row flex-col">

      <div class="mx-2 flex flex-row md:flex-1 pl-0">
        <img
          :src="song.image"
          class="w-12 h-12 my-1"
          ref="image"
          @load="updateColours"
          crossorigin="Anonymous"
        >
        <div class="mx-2 flex-1 min-w-0">
          <marquee-text class="text-sm h-5" :text="song.title" />
          <p class="text-xs truncate w-full">
            {{ song.album }}
          </p>
          <p class="text-xs truncate w-full">
            {{ song.creator }}
          </p>
        </div>
      </div>

      <div class="md:w-auto w-full flex flex-row items-center pb-2 px-2">
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

        <span
          v-if="$store.getters['favourites/locations'].includes(song.location)"
          class="p-2 focus:outline-none"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="currentColor" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </span>
        <button
          v-else
          @click="$store.dispatch('favourites/add', { folder: 'Uncategorised', song })"
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
    </div>

    <div class="w-full flex-1" ref="audio">
    </div>
  </div>
</template>

<script>
import MarqueeText from '@/components/MarqueeText.vue'

export default {
  name: 'PlayingBar',
  components: {
    MarqueeText,
  },
  props: {
    song: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      songProgress: 0,
      songTime: 0,

      paused: true,
      playDisabled: false,

      intervalId: null,
    }
  },
  computed: {
    currentSong () {
      return this.$store.state.audiocache[this.song.location]
    },
  },
  methods: {
    async playCurrentSong () {
      const element = this.$store.state.audiocache[this.song.location]
      this.$refs.audio.innerHTML = ''
      this.$refs.audio.appendChild(element)

      element.addEventListener('play', () => {
        this.paused = false
        this.updateProgress()
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

      element.addEventListener('pause', ({ target }) => {
        // Maybe the pause event is fired on the old song
        if (target.src === this.song.location) {
          this.paused = true
          this.playDisabled = false
        }
      })

      element.addEventListener('error', () => {
        setTimeout(this.playNextSong, 3000)
      })

      element.addEventListener('ended', () => {
        if (this.$store.getters['hasNextSong']) {
          this.playNextSong()
        }
      })

      await element.play()
      this.paused = false
      this.playDisabled = false
    },
    loadNextSong () {
      const nextSong = this.$store.state.playlist[this.$store.state.playingIndex + 1]
      if (nextSong) {
        this.$store.dispatch('audiocache/preload', nextSong)
      }
    },
    async togglePlaying () {
      this.updateProgress()

      if (this.currentSong.paused) {
        this.playDisabled = true
        await this.currentSong.play()
        this.paused = false
        this.playDisabled = false
        this.updateProgress()

      } else if (!this.playDisabled) {
        this.currentSong.pause()
        this.paused = true
        this.updateProgress()
      }
    },
    async playNextSong () {
      if (this.playDisabled) {
        return
      }

      this.resetPlay()
      this.$store.dispatch('nextSong')

      this.playDisabled = true
      await this.currentSong.play()
      this.playDisabled = false
      this.paused = false
    },
    async playPreviousSong () {
      if (this.playDisabled) {
        return
      }

      if (this.currentSong.currentTime > 5) {
        this.paused = false
        this.playDisabled = false
        this.resetPlay()
        this.currentSong.currentTime = 0
        await this.currentSong.play()
      } else {
        this.paused = false
        this.playDisabled = false
        this.resetPlay()
        this.$store.dispatch('previousSong')
      }
    },
    updateProgress () {
      this.songTime = this.currentSong.currentTime
      this.songProgress = this.currentSong.currentTime / this.currentSong.duration
    },
    async updateColours () {
      const colours = await this.$store.dispatch('colourcache/getTheme', {
        image: this.$refs.image,
      })
      console.log(colours)

      const playingBar = this.$refs.playingBar
      playingBar.style.setProperty('--colour-fg-light', `#${colours.dark}`)
      playingBar.style.setProperty('--colour-bg-light', `#${colours.light}`)
      playingBar.style.setProperty('--colour-fg-dark', `#${colours.light}`)
      playingBar.style.setProperty('--colour-bg-dark', `#${colours.dark}`)
    },
    resetPlay () {
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
    this.intervalId = setInterval(this.updateProgress, 1000)
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
  beforeDestroy () {
    clearInterval(this.intervalId)
  },
}
</script>

<style scoped>
.playing-bar {
  --bg-colour-fg-light: #2d3748;
  --bg-colour-bg-light: #edf2f7;
  --bg-colour-fg-dark: #edf2f7;
  --bg-colour-bg-dark: #2d3748;
}

@media (prefers-color-scheme: light) {
  .playing-bar {
    color: var(--bg-colour-fg-light);
    background-color: var(--bg-colour-bg-light);
  }

  progress[value]::-webkit-progress-bar {
    background-image: linear-gradient(90deg, #FFFFFF00 0%, #FFFFFF00 var(--progress-buffered), #FFFFFFAA var(--progress-buffered), #FFFFFFAA 100%);
    background-color: var(--bar-colour-bg-light);
  }

  progress[value]::-webkit-progress-value {
    background-color: var(--bar-colour-fg-light);
  }
}

@media (prefers-color-scheme: dark) {
  .playing-bar {
    color: var(--bar-colour-fg-dark);
    background-color: var(--bar-colour-bg-dark);
  }

  progress[value]::-webkit-progress-bar {
    background-image: linear-gradient(90deg, #FFFFFF55 0%, #FFFFFF55 var(--progress-buffered), #FFFFFF00 var(--progress-buffered), #FFFFFF00 100%);
    background-color: var(--bar-colour-bg-dark);
  }

  progress[value]::-webkit-progress-value {
    background-color: var(--bar-colour-fg-dark);
  }
}
</style>
