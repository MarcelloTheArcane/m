<template>
  <div class="bg-gray-200">
    <div v-if="errorMessage" class="text-center text-red-600">
      {{ errorMessage }}
    </div>
    <div v-else class="flex flex-col items-center h-full">
      <img src="@/assets/defaultimage.png" class="h-32 w-32 m-5 rounded">
      <h1 class="text-lg text-gray-800 text-center">
        {{ this.$route.params.name }}
      </h1>

      <button-list
        @play-all="playAll"
        @play-next="playNext"
        @append-queue="appendQueue"
      />

      <div class="w-full flex-1 bg-white">
        <song-result
          v-for="(result, index) in results"
          :key="index"
          :result="result"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SongResult from '@/components/SongResult.vue'
import ButtonList from '@/components/ButtonList.vue'

export default {
  name: 'StationPage',
  components: {
    SongResult,
    ButtonList,
  },
  data () {
    return {
      results: [],
      errorMessage: '',
    }
  },
  async mounted () {
    try {
      this.results = await this.$store.dispatch('getListenNowList', {
        station: this.$route.params.id,
      })
    } catch (err) {
      console.error(err)
      this.errorMessage = err.message
    }
  },
  methods: {
    playAll () {
      this.$store.dispatch('setPlaylist', this.results)
    },
    playNext () {
      this.$store.dispatch('setPlayNext', this.results)
    },
    appendQueue () {
      this.$store.dispatch('addToPlaylist', {
        index: this.$store.state.playlist.length,
        newList: this.results,
      })
    },
  },
  metaInfo () {
    return {
      title: this.$route.params.name,
    }
  },
}
</script>
