const v3StorageKey = 'gmp_favourites_v3'

export default function subscriptions (store) {
  store.subscribe((mutation, state) => {
    if (mutation.type.match(/^favourites\//)) {
      localStorage.setItem(v3StorageKey, JSON.stringify(state.favourites))
    }
  })
}
