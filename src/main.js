// Import System requirements
import Vue from 'vue'
import VueRouter from 'vue-router'
// import VueResource from 'vue-resource'

// html5 wysiwyg editor
import Vueditor from 'vueditor'
import 'vueditor/dist/css/vueditor.min.css'

// animate.css
import 'animate.css/animate.min.css'

// Import Auth dep
import axios from 'axios'
import VueAxios from 'vue-axios'
// import VueAuth from '@websanova/vue-auth'
import auth from './auth'

import { sync } from 'vuex-router-sync'
import routes from './routes'
import store from './store'

// Import Helpers for filters
import { domain, count, prettyDate, pluralize } from './filters'

// Import Views - Top level
import AppView from './components/App.vue'

// Import Install and register helper items
Vue.filter('count', count)
Vue.filter('domain', domain)
Vue.filter('prettyDate', prettyDate)
Vue.filter('pluralize', pluralize)

// Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(VueAxios, axios)

// Routing logic
var router = new VueRouter({
  routes: routes,
  mode: 'history',
  scrollBehavior: function (to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 }
  }
})

Vue.router = router

router.beforeEach((to, from, next) => {
  if (to.meta.auth) { // check the meta field
    if (auth.checkAuth()) {
      // console.log('auth')
      next()
    } else {
      // console.log('no_auth')
      next('/auth') // Redirect the user to the login page
    }
  } else {
    // console.log('auth')
    next()
  }
})

sync(store, router)

// wysiwyg editor config
Vue.use(Vueditor, {
  fontName: [
    {val: 'arial black'}, {val: 'times new roman'}, {val: 'Courier New'}
  ],
  lang: 'en'
})

// Start out app!
// eslint-disable-next-line no-new
new Vue({
  el: '#root',
  router: router,
  store: store,
  render: h => h(AppView)
})

// Check local storage to handle refreshes
if (window.localStorage) {
  var idToken = window.localStorage.getItem('id_token')
  var accessToken = window.localStorage.getItem('access_token')
  var wallets = JSON.parse(window.localStorage.getItem('wallets'))

  if (store.state.wallets !== wallets && wallets != null) {
    store.commit('SYNC_WALLETS', wallets)
  }
  console.log(window.localStorage.getItem('wallets'))
  console.log(store.state.wallets)

  if (store.state.jwt.idToken !== idToken) {
    store.commit('SET_idToken', idToken)
    store.commit('SET_accessToken', accessToken)
  }
  // console.log(store.state.user)
} else {
  console.log(false)
}
