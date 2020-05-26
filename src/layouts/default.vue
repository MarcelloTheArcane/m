<template>
  <div>
    <div class="mx-2 my-3">
      <router-link
        to="/search"
        class="select-none text-gray-500 border border-gray-500 w-full block p-2"
      >
        Search...
      </router-link>
    </div>
    <router-view />
    <playing-bar :song="$store.getters.nowPlaying" />
  </div>
</template>

<script>
import PlayingBar from '@/components/PlayingBar.vue'

export default {
  name: 'DefaultLayout',
  components: {
    PlayingBar,
  },
}
</script>
