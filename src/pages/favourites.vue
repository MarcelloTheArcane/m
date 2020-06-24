<template>
  <div class="flex flex-col items-center h-full bg-transparent">
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
      <div
        v-for="(folder, name) in $store.getters['favourites/byFolder']"
        :key="name"
        class="mb-6"
      >
        <div
          class="mb-2 px-2 flex flex-row justify-between items-center cursor-pointer"
          @click="toggleFolder(name)"
        >
          <h2 class="text-xl select-none">
            {{ name }}
          </h2>
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            :style="{
              transition: 'transform 0.2s',
              transform: showingFolder.includes(name) ? 'rotate(-180deg)' : 'rotate(0)'
            }"
          >
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </div>

        <div v-if="showingFolder.includes(name)">
          <button-list
            v-if="folder.length !== 0"
            @play-all="playAll(folder)"
            @play-next="playNext(folder)"
            @append-queue="appendQueue(folder)"
            class="mt-0 mb-4"
          />
          <favourites-result
            v-for="(result, index) in folder"
            :key="index"
            :result="result.song"
            :index="index"
          />
          <p
            v-if="folder.length === 0"
            class="text-center text-gray-800"
          >
            This folder is empty
          </p>
        </div>
      </div>

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
  data () {
    return {
      showingFolder: [],
    }
  },
  methods: {
    toggleFolder (name) {
      if (this.showingFolder.includes(name)) {
        const newShowingFolder = this.showingFolder.filter(folder => folder !== name)
        this.showingFolder.splice(0, this.showingFolder.length, ...newShowingFolder)
      } else {
        // Add to the start, so removing is quicker
        this.showingFolder.splice(0, 0, name)
      }
    },
    playAll (songs) {
      this.$store.dispatch('setPlaylist', songs.map(({ song }) => song))
    },
    playNext (songs) {
      this.$store.dispatch('setPlayNext', songs.map(({ song }) => song))
    },
    appendQueue (songs) {
      this.$store.dispatch('addToPlaylist', {
        index: this.$store.state.playlist.length,
        newList: songs.map(({ song }) => song),
      })
    },
  },
  mounted () {
    this.$store.dispatch('favourites/migrate')
  },
}
</script>
