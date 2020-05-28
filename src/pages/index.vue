<template>
  <div class="bg-gray-200 grid grid-cols-2 gap-3 px-2 pb-4">
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
      <p class="text-gray-900 text-center">
        {{ title }}
      </p>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data () {
    return {
      songs: [],
    }
  },
  async mounted () {
    // this.songs = await this.$store.dispatch('getTopSongs')
    // this.songs = await this.$store.dispatch('getAllStations')
    this.songs = await this.$store.dispatch('getListenNow')
  },
  metaInfo () {
    return {
      title: 'Stations',
    }
  },
}
</script>

<style scoped>
.h-33vw {
  height: 33vw;
}

.bg-gradient {
  background: linear-gradient(135deg, rgba(226,232,240,1) 0%, rgba(237,242,247,1) 35%, rgba(203,213,224,1) 100%);
}
</style>
