import ColourThief from 'colorthief/dist/color-thief.mjs'
const colourThief = new ColourThief()

export default {
  namespaced: true,
  state () {
    return {}
  },
  mutations: {
    ADD_TO_CACHE (state, [ key, value ]) {
      state[key] = value
    },
  },
  actions: {
    load ({ state, commit }, { image, url }) {
      const cachePath = btoa(url)
      if (!state[cachePath]) {
        const data = colourThief.getPalette(image, 2)
        if (!data) {
          return
        }

        const [light, dark] = data.map(calculateGreyscale).sort(byGreyscale)

        commit('ADD_TO_CACHE', [
          cachePath,
          {
            light: light.colour,
            dark: dark.colour,
          },
        ])
      }

      // Set css properties with data
      document.documentElement.style.setProperty('--colour-fg-light', `#${state[cachePath].dark}`)
      document.documentElement.style.setProperty('--colour-bg-light', `#${state[cachePath].light}`)
      document.documentElement.style.setProperty('--colour-fg-dark', `#${state[cachePath].light}`)
      document.documentElement.style.setProperty('--colour-bg-dark', `#${state[cachePath].dark}`)
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

      document.documentElement.style.setProperty('--colour-fg-light', defaultColourOneLight)
      document.documentElement.style.setProperty('--colour-bg-light', defaultColourTwoLight)
      document.documentElement.style.setProperty('--colour-fg-dark', defaultColourOneDark)
      document.documentElement.style.setProperty('--colour-bg-dark', defaultColourTwoDark)
    },
    getTheme ({ state, commit }, { image, url }) {
      const cachePath = btoa(url)
      if (!state[cachePath]) {
        const data = colourThief.getPalette(image, 2)
        if (!data) {
          return '#EDF2F7'
        }

        const [light, dark] = data.map(calculateGreyscale).sort(byGreyscale)

        commit('ADD_TO_CACHE', [
          cachePath,
          {
            light: light.colour,
            dark: dark.colour,
          },
        ])
      }

      return state[cachePath].light
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

