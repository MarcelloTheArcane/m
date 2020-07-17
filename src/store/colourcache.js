import ColourThief from 'colorthief/dist/color-thief.mjs'
const colourThief = new ColourThief()

export default {
  namespaced: true,
  actions: {
    async load ({ dispatch }, { image }) {
      const { light, dark } = await dispatch('getTheme', { image })
      // Set css properties with data
      document.body.style.setProperty('--colour-fg-light', `#${dark}`)
      document.body.style.setProperty('--colour-bg-light', `#$light}`)
      document.body.style.setProperty('--colour-fg-dark', `#${light}`)
      document.body.style.setProperty('--colour-bg-dark', `#${dark}`)
    },
    unload () {
      // Unset css properties
      const defaultColourOneLight = getComputedStyle(document.documentElement)
        .getPropertyValue('--default-colour-fg-light')
      const defaultColourTwoLight = getComputedStyle(document.documentElement)
        .getPropertyValue('--default-colour-bg-light')
      const defaultColourOneDark = getComputedStyle(document.documentElement)
        .getPropertyValue('--default-colour-fg-dark')
      const defaultColourTwoDark = getComputedStyle(document.documentElement)
        .getPropertyValue('--default-colour-bg-dark')

      document.body.style.setProperty('--colour-fg-light', defaultColourOneLight)
      document.body.style.setProperty('--colour-bg-light', defaultColourTwoLight)
      document.body.style.setProperty('--colour-fg-dark', defaultColourOneDark)
      document.body.style.setProperty('--colour-bg-dark', defaultColourTwoDark)
    },
    async getTheme (_, { image }) {
      const data = await colourThief.getPalette(image, 2)
      const [light, dark] = data.map(calculateGreyscale).sort(byGreyscale)
      
      return {
        light: light.colour,
        dark: dark.colour,
      }
    },
  },
}

function toHex (colourArray) {
  return colourArray
    .map(value => value.toString(16).padStart(2, '0'))
    .join('')
}

function calculateGreyscale (colour) {
  return {
    greyscale: Math.floor((colour[0] + colour[1] + colour[2]) / 3),
    colour: toHex(colour),
  }
}

function byGreyscale (a, b) {
  return b.greyscale - a.greyscale
}

