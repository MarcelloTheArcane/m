<template>
  <div ref="menu">
    <component
      v-for="(item, index) in options"
      :key="index"
      :is="item.el"
      v-on="item.vOn"
      :to="item.to"
      :href="item.href"
      class="block w-full px-2 py-2 text-left text-gray-800 select-none bg-transparent"
    >
      {{ item.text }}
    </component>
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
    options: {
      type: Array,
      required: false,
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
