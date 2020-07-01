import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

export default {
  namespaced: true,
  state () {
    return {
      url: 'https://db.neelr.dev/api/de70223756afd40bc29e99ae21a2a3f1',
    }
  },
  actions: {
    async getList ({ state }, key) {
      try {
        const { data } = await axios.get(`${state.url}/${key}`)
        return data
      } catch (err) {
        console.log(err)
        return {}
      }
    },
    async createList ({ state }, { name, songs }) {
      const id = uuidv4()
      await axios.post(`${state.url}/${id}`, {
        name,
        songs,
        exists: true,
      })
      return id
    },
  },
}
