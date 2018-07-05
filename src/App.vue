<template>
  <div id="app">
    <Header></Header>
    <Nav></Nav>
    <transition name="fade1">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
    <player></player>
  </div>
</template>

<script>
import Header from "components/header/header";
import Nav from "components/nav/nav";
import player from "components/player/player";
export default {
  name: "App",
  components: {
    Header,
    Nav,
    player
  },
  methods: {
    aaa: function() {
      alert("5");
    }
  }
};
</script>

<style lang="scss">
@import "assets/css/reset.css";
@import "assets/css/mixin.scss";
#app {
  min-width: 100vw;
  min-height: 100vh;
  background: rgb(34, 34, 34);
  // padding-top: rem(88);
  // overflow: hidden;
}
html {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: rgb(34, 34, 34);
}
/* 子路由进去动画 */
.fade1-enter-active{
  transition: all 0.2s;
}
// .fade1-leave-active {
  // transition: all 0.1s;
// }
.fade1-enter{
  opacity: 0;
  transform: translate3d(20%, 0, 0);
}
.fade1-enter{
  opacity: 0.9;
}
// .fade1-leave-to {
  // opacity: 0;
  // transform: translate3d(-100%, 0, 0);
// }
</style>
