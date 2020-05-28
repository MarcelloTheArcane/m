import Vue from 'vue'
import App from './App.vue'
import VueLazyload from 'vue-lazyload'
import VueMeta from 'vue-meta'

import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.use(VueMeta)

Vue.use(VueLazyload, {
  error: require('@/assets/defaultimage.png'),
  loading: require('@/assets/defaultimage.png'),
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
