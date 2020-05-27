<template>
  <div class="h-screen overflow-hidden flex flex-col">
    <search-box />
    <router-view class="flex-1 overflow-y-auto" />
    <playing-bar :song="$store.getters.nowPlaying" />
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
