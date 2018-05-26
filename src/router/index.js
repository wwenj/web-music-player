import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/recommend',
      name: 'Recommend',
      component: (resolve) => require(['@/components/recommend/recommend'], resolve)
    },
    {
      path: '/singer',
      name: 'Singer',
      component: (resolve) => require(['@/components/singer/singer'], resolve)
    },
    {
      path: '/rank',
      name: 'Rank',
      component: (resolve) => require(['@/components/rank/rank'], resolve)
    },
    {
      path: '/search',
      name: 'Search',
      component: (resolve) => require(['@/components/search/search'], resolve)
    }
  ]
})
