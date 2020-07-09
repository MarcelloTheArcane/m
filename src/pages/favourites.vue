<template>
  <div class="bg-transparent">
    <div class="flex flex-col items-center h-full relative">
      <img
        src="@/assets/favourites.png"
        class="h-32 w-32 m-5 rounded"
      >

      <h1 class="text-lg text-center">
        Favourites
      </h1>

      <div class="w-full bg-white rounded-t-lg p-3 mt-5">
        &nbsp;
      </div>

      <div class="w-full flex-1 bg-white">
        <favourites-folder
          v-for="(folder, name) in $store.state.favourites"
          :key="name"
          :folder="folder"
          :name="name"
        />

        <p
          v-if="$store.state.favourites.length === 0"
          class="text-center text-gray-800"
        >
          Your favourites list is empty
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import FavouritesFolder from '../components/FavouritesFolder.vue'

export default {
  name: 'FavouritesPage',
  components: {
    FavouritesFolder,
  },
  mounted () {
    this.$store.dispatch('favourites/migrate')
  },
}
</script>
