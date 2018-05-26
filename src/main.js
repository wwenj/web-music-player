// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'assets/js/amfe-flexible.js'
// import 'assets/css/mixin.scss';
import fastclick from 'fastclick'

fastclick.attach(document.body) // 解决移动端事件300ms延时

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
