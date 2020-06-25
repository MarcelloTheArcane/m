<template>
  <div ref="menu">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ContextMenu',
  props: {
    scrollId: {
      type: String,
      required: true,
    },
    toggleDimensions: {
      type: DOMRect,
      required: true,
    },
  },
  mounted () {
    const scrollbox = document.getElementById(this.scrollId)

    const menu = this.$refs.menu
    const scrollboxDimensions = scrollbox.getBoundingClientRect()
    const menuDimensions = menu.getBoundingClientRect()
    const maxHeight = Math.min(window.innerHeight, scrollboxDimensions.bottom)

    const topWithinBounds = this.toggleDimensions.top + menuDimensions.height > maxHeight
    const menuHeightMoreThanSpace = scrollboxDimensions.height < menuDimensions.height

    if (menuHeightMoreThanSpace || !topWithinBounds) {
      const top = scrollbox.scrollTop + this.toggleDimensions.top - scrollboxDimensions.top - 4
      menu.style.top = `${top}px`
    } else {
      const bottom = maxHeight - scrollbox.scrollTop - this.toggleDimensions.bottom + 4
      menu.style.bottom = `${bottom}px`
    }
  },
}
</script>
