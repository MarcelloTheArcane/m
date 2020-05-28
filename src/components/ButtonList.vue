<template>
  <div class="w-full bg-white rounded-t-lg p-3 mt-5 flex flex-row">
    <span class="flex-1">&nbsp;</span>
    <button
      @click="$emit('append-queue')"
      class="border-gray-500 border text-center mx-2 py-2 px-3 bg-gray-100"
      title="Add to queue"
    >
      Add to queue
    </button>
    <button
      @click="$emit('play-next')"
      class="border-gray-500 border text-center mx-2 py-2 px-3 bg-gray-100"
      title="Play album next"
    >
      Play all next
    </button>
    <button
      @click="$emit('play-all')"
      class="border-gray-500 border text-center mx-2 py-2 px-3 bg-gray-100"
      title="Play album"
    >
      Play all now
    </button>
  </div>
</template>

<script>
export default {
  name: 'ButtonList',
}
</script>
