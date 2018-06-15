<template>
  <div id="app">
    <Header></Header>
    <Nav></Nav>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
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
html{
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: rgb(34, 34, 34);
}
</style>
