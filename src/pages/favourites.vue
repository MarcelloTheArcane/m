<template>
  <div class="flex flex-col items-center h-full bg-transparent">
    <img
      src="@/assets/favourites.png"
      class="h-32 w-32 m-5 rounded"
    >

    <h1 class="text-lg text-center">
      Favourites
    </h1>

    <button-list
      v-if="$store.state.favourites.length"
      @play-all="playAll"
      @play-next="playNext"
      @append-queue="appendQueue"
    />
    <div v-else class="w-full bg-white rounded-t-lg p-3 mt-5">
      &nbsp;
    </div>

    <div class="w-full flex-1 bg-white">
      <favourites-result
        v-for="(result, index) in $store.state.favourites"
        :key="index"
        :result="result"
        :index="index"
      />

      <p
        v-if="$store.state.favourites.length === 0"
        class="text-center text-gray-800"
      >
        Your favourites list is empty
      </p>
    </div>
  </div>
</template>

<script>
import FavouritesResult from '../components/FavouritesResult.vue'
import ButtonList from '../components/ButtonList.vue'

export default {
  name: 'FavouritesPage',
  components: {
    FavouritesResult,
    ButtonList,
  },
  methods: {
    playAll () {
      this.$store.dispatch('setPlaylist', this.$store.state.favourites)
    },
    playNext () {
      this.$store.dispatch('setPlayNext', this.$store.state.favourites)
    },
    appendQueue () {
      this.$store.dispatch('addToPlaylist', {
        index: this.$store.state.playlist.length,
        newList: this.$store.state.favourites,
      })
    },
  },
}
</script>
