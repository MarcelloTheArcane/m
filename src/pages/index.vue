<template>
  <div class="bg-transparent px-2 pb-4">
    <div v-if="errorMessage" class="text-center text-red-600">
      {{ errorMessage }}
    </div>
    <div v-else-if="songs.length === 0" class="text-center">
      Loading...
    </div>
    <div v-else class="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-3">
      <router-link
        v-for="({ station, title }, index) in songs"
        :key="index"
        :to="`/station/${station}/${title}`"
      >
        <div class="w-full flex items-center justify-center bg-gray-200 bg-gradient shadow rounded h-33vw">
          <svg viewBox="0 0 24 24" width="42" height="42" stroke="#718096" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </div>
        <p class="text-center">
          {{ title }}
        </p>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data () {
    return {
      songs: [],
      errorMessage: '',
    }
  },
  async mounted () {
    try {
      this.songs = await this.$store.dispatch('getListenNow')
    } catch (err) {
      console.error(err)
      this.errorMessage = err.message
    }
  },
  metaInfo () {
    return {
      title: 'Stations',
    }
  },
}
</script>

<style scoped>
@media (max-width: 639px) {
  .h-33vw {
    height: 33vw;
  }
}

@media (min-width: 640px) {
  .h-33vw {
    height: 22vw;
  }
}

@media (min-width: 768px) {
  .h-33vw {
    height: 16.6667vw;
  }
}

@media (prefers-color-scheme: light) {
  .bg-gradient {
    background: linear-gradient(135deg, rgb(226, 232, 240) 0%, rgb(237, 242, 247) 35%, rgb(203, 213, 224) 100%);
  }
}

@media (prefers-color-scheme: dark) {
  .bg-gradient {
    background: linear-gradient(135deg, rgb(45, 55, 72) 0%, rgb(74, 85, 104) 35%, rgb(26, 32, 44) 100%);
  }
}
</style>
