// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'assets/js/amfe-flexible.js'
// import 'assets/css/mixin.scss';
import store from './store'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'

fastclick.attach(document.body) // 解决移动端事件300ms延时

Vue.use(VueLazyload, {
  error: require('./assets/img/error.jpg'),
  loading: require('./assets/img/loading.gif')
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
