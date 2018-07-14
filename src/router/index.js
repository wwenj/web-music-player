import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: '/recommend',
    name: 'App',
    component: (resolve) => require(['@/components/recommend/recommend'], resolve)
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: (resolve) => require(['@/components/recommend/recommend'], resolve),
    children: [{
      path: ':id',
      component: (resolve) => require(['@/components/recommend/components/recomDetail'], resolve)
    }]
  },
  {
    path: '/singer',
    name: 'Singer',
    component: (resolve) => require(['@/components/singer/singer'], resolve),
    children: [{
      path: ':id',
      component: (resolve) => require(['@/components/singer/components/singerDetail'], resolve)
    }]
  },
  {
    path: '/rank',
    name: 'Rank',
    component: (resolve) => require(['@/components/rank/rank'], resolve),
    children: [{
      path: ':id',
      component: (resolve) => require(['@/components/rank/components/rankDetail'], resolve)
    }]
  },
  {
    path: '/search',
    name: 'Search',
    component: (resolve) => require(['@/components/search/search'], resolve),
    children: [{
      path: ':id',
      component: (resolve) => require(['@/components/singer/components/singerDetail'], resolve)
    }]
  },
  {
    path: '/user',
    name: 'User',
    component: (resolve) => require(['@/components/userCenter/userCenter'], resolve)
  }
  ]
})
