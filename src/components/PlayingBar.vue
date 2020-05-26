<template>
  <div class="fixed bottom-0 left-0 right-0 p-2" style="background-color: #f1f3f4;">
    <p class="text-sm text-gray-800">
      {{ song.title }}
    </p>
    <p class="text-xs text-gray-600">
      {{ song.album }}
    </p>
    <p class="text-xs text-gray-600">
      {{ song.creator }}
    </p>
    <audio controls autoplay :src="song.location" class="w-full" />
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

