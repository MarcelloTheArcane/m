import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const graphql = axios.create({
  baseURL: 'https://hasura-2bv4ecau.nhost.app/v1',
  headers: {
    accept: 'application/json',
  },
})

if (!sessionStorage.getItem('session')) {
  sessionStorage.setItem('session', `${uuidv4()}|${new Date().toJSON()}`)
}

export default {
  namespaced: true,
  state () {
    return {
      session: sessionStorage.getItem('session'),
    }
  },
  actions: {
    async track ({ state }, toTrack) {
      try {
        await graphql.post('/graphql', {
          query: `mutation track ($t: String!, $s: String!, $d: jsonb!) {
            insert_gmp_tracking (objects: {type: $t, session: $s, data: $d}) {affected_rows}
          }`,
          variables: {
            t: toTrack.type,
            s: state.session,
            d: JSON.stringify(toTrack.data),
          },
        })
      } catch (err) {
        console.error(err)
      }
    },

    async session ({ dispatch }) {
      const { data } = await axios.get('https://ipapi.co/json')

      await dispatch('track', {
        type: 'load',
        data: {
          ip: data,
          device: {
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth,
            location: window.location,
            userAgent: navigator.userAgent,
          },
        },
      })
    },
    async search ({ dispatch }, data) {
      await dispatch('track', {
        type: 'search',
        data,
      })
    },
    async play ({ dispatch }, data) {
      await dispatch('track', {
        type: 'play',
        data,
      })
    },
    async navigate ({ dispatch }, data) {
      await dispatch('track', {
        type: 'navigate',
        data,
      })
    },
  },
}
