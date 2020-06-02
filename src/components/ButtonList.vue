<template>
  <div class="w-full bg-white rounded-t-lg p-3 mt-5 flex flex-row">
    <span class="flex-1">&nbsp;</span>
    <button
      @click="$emit('append-queue')"
      class="border-gray-500 border text-center text-sm mx-2 py-2 px-3 bg-gray-200 text-gray-800"
      title="Add to queue"
    >
      Queue
    </button>
    <button
      @click="$emit('play-next')"
      class="border-gray-500 border text-center text-sm mx-2 py-2 px-3 bg-gray-200 text-gray-800"
      title="Play album next"
    >
      Next
    </button>
    <button
      @click="$emit('play-all')"
      class="border-gray-500 border text-center text-sm mx-2 py-2 px-3 bg-gray-200 text-gray-800"
      title="Play album"
    >
      Play
    </button>
  </div>
</template>

<script>
export default {
  name: 'ButtonList',
}
</script>
