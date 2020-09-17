<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    this.$store.dispatch('tracking/session')
  },
  metaInfo () {
    return {
      title: 'gmp',
      meta: [
        { name: 'theme-color', content: '#fff', vmid: 'theme' },
      ],
    }
  },
}
</script>

<style src="@/assets/tailwind.css">
