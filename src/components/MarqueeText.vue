<template>
  <div class="">
    <div ref="container" class="overflow-hidden h-full">
      <p class="relative w-full h-full">
        <span ref="text1" class="text-1 animate absolute whitespace-no-wrap pr-4">
          {{ text }}
        </span>
        <span ref="text2" class="text-2 animate absolute whitespace-no-wrap pr-4">
          {{ text }}
        </span>
        &nbsp;
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MarqueeText',
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  methods: {
    async setVariables () {
      this.$refs.text1.classList.remove('animate')
      this.$refs.text2.classList.remove('animate')

      await this.$nextTick()

      const scroll = this.$refs.text1.offsetWidth
      const offset = this.$refs.container.offsetWidth

      if (scroll >= offset) {
        this.$refs.text1.style.setProperty('--scroll', scroll + 'px')
        this.$refs.text1.style.setProperty('--offset', offset + 'px')
        this.$refs.text2.style.setProperty('--scroll', scroll + 'px')
        this.$refs.text2.style.setProperty('--offset', offset + 'px')
  
        this.$refs.text1.classList.add('animate')
        this.$refs.text2.classList.add('animate')
      }
    }
  },
  mounted () {
    this.setVariables()

    window.addEventListener('resize', () => {
      this.setVariables()
    })
  },
  watch: {
    text () {
      this.setVariables()
    }
  }
}
</script>

<style scoped>
.text-1.animate {
  animation: scroll 16s linear infinite;
  animation-delay: -8s;
}

.text-2.animate {
  animation: scroll 16s linear infinite;
}

.text-1 {
  --scroll: 0;
  --offset: 0;
  margin-left: 0;
}

.text-2 {
  --scroll: 0;
  --offset: 0;
  margin-left: var(--offset);
}

@keyframes scroll {
  0% {
    margin-left: var(--offset);
  }
  80% {
    margin-left: calc(-1 * var(--scroll));
  }
  100% {
    margin-left: calc(-1 * var(--scroll));
  }
}
</style>
