<template>
  <div class="flex flex-col items-center bg-gray-200">
    <img src="@/assets/defaultimage.png" class="h-32 w-32 m-5 rounded">
    <h1 class="text-lg text-gray-800">
      Playlist
    </h1>

    <div class="w-full bg-white rounded-t-lg p-3 mt-5">
      &nbsp;
    </div>

    <div class="w-full flex-1 bg-white">
      <playlist-result
        v-for="(result, index) in $store.state.playlist"
        :key="index"
        :result="result"
        :index="index"
      />
    </div>
  </div>
</template>

<script>
import PlaylistResult from '@/components/PlaylistResult.vue'

export default {
  name: 'ThePlaylist',
  components: {
    PlaylistResult,
  },
}
</script>

<style scoped>
  
</style>
