import ColourTheif from 'colour-theif'
const colourTheif = new ColourTheif()

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
    async load ({ state, commit }, { file, url }) {
      const cachePath = btoa(url)
      if (!state[cachePath]) {
        const data = await colourTheif.getPallete(file)
        commit('ADD_TO_CACHE', [ cachePath, data ])
      }

      // Set css properties with data
    },
    unload () {
      // Unset css properties
    }
  },
}
