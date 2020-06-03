<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  metaInfo () {
    return {
      title: 'gmp',
      meta: [
        { name: 'theme-color', content: '#fff', vmid: 'theme' },
      ],
    }
  },
  mounted () {
    window.onbeforeunload = () => {
      return this.$store.getters.cannotSafelyReload || undefined
    }
  },
}
</script>

<style src="@/assets/tailwind.css">
