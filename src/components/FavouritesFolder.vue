<template>
  <div class="mb-6">
    <div
      class="mb-2 px-2 flex flex-row justify-between items-center cursor-pointer"
    >
      <h2 class="text-xl select-none flex-1">
        <input
          v-model="newName"
          @blur="$store.dispatch('favourites/renameFolder', { oldName, newName })"
          type="text"
          class="w-full bg-transparent"
        >
      </h2>
      <button
        @click="showingFolder = !showingFolder"
        class="p-2 focus:outline-none"
      >
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
            transform: showingFolder ? 'rotate(-180deg)' : 'rotate(0)'
          }"
        >
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>
    </div>

    <div v-if="showingFolder">
      <button-list
        v-if="folder.length !== 0"
        :list="$store.state.favourites[name]"
        :list-name="name"
        class="mt-0 mb-4"
      />
      <favourites-result
        v-for="(result, index) in folder"
        :key="index"
        :result="result"
        :index="index"
        :folder="name"
        :id="index"
      />
      <p
        v-if="folder.length === 0"
        class="text-center text-gray-800"
      >
        This folder is empty
      </p>
    </div>
  </div>
</template>

<script>
import ButtonList from '@/components/ButtonList.vue'
import FavouritesResult from '@/components/FavouritesResult.vue'

export default {
  name: 'FavouritesFolder',
  components: {
    ButtonList,
    FavouritesResult,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    folder: {
      type: Array,
      required: true,
    },
  },
  data () {
    return {
      showingFolder: false,
      oldName: this.name,
      newName: this.name,
    }
  },
}
</script>
