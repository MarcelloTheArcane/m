<template>
  <div class="p-2" style="background-color: #f1f3f4;">
    <div class="flex flex-row" v-if="song.location">
      <img v-lazy="song.image" class="w-12 h-12 my-1">
      <div class="mx-2 flex-1 min-w-0">
        <p class="text-sm text-gray-800 truncate w-full">
          {{ song.title }}
        </p>
        <p class="text-xs text-gray-600 truncate w-full">
          {{ song.album }}
        </p>
        <p class="text-xs text-gray-600 truncate w-full">
          {{ song.creator }}
        </p>
      </div>
    </div>
    <audio controls autoplay :src="song.location" class="w-full focus:outline-none" />
  </div>
</template>

<script>
export default {
  name: 'PlayingBar',
  props: {
    song: {
      type: Object,
      required: false,
      default () {
        return {}
      },
    },
  },
}
</script>

