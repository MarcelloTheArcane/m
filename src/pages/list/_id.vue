<template>
  <div class="bg-transparent">
    <div v-if="loading" class="text-center text-gray-800">
      Loading...
    </div>
    <div v-else-if="!this.result.exists" class="text-center text-red-600">
      This list can't be found.
    </div>
    <div v-else class="flex flex-col items-center h-full relative">
      <img src="@/assets/defaultimage.png" class="h-32 w-32 m-5 rounded">
      <h1 class="text-lg text-center px-6">
        {{ this.result.name }}
      </h1>

      <button-list
        :list="result.songs"
        :list-name="this.result.name"
        class="mt-5"
      />

      <div class="w-full flex-1 bg-white">
        <song-result
          v-for="(song, index) in result.songs"
          :key="index"
          :result="song"
          scroll-id="pagebox"
        />
      </div>
    </div>
  </div>
</template>

<script>
// import uuid from 'uuid'
import ButtonList from '@/components/ButtonList.vue'
import SongResult from '@/components/SongResult.vue'

export default {
  name: 'TheList',
  components: {
    ButtonList,
    SongResult,
  },
  data () {
    return {
      loading: true,
      result: {},
    }
  },
  async mounted () {
    this.result = await this.$store.dispatch('db/getList', this.$route.params.id)
    this.loading = false
  },
  metaInfo () {
    return {
      title: this.result.name
        ? this.result.name
        : 'Loading...',
    }
  },
}
</script>
