<template>
  <div class="h-screen overflow-hidden flex flex-col">
    <search-box />
    <router-view id="pagebox" class="flex-1 overflow-y-auto lg:px-48 md:px-20 sm:px-0 px-0" />
    <playing-bar
      :song="$store.getters.nowPlaying"
      v-if="$store.getters.nowPlaying && $store.getters.nowPlaying.location"
    />
  </div>
</template>

<script>
import SearchBox from '@/components/SearchBox.vue'
import PlayingBar from '@/components/PlayingBar.vue'

export default {
  name: 'DefaultLayout',
  components: {
    SearchBox,
    PlayingBar,
  },
}
</script>
