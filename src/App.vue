<template>
  <div id="app">
    <Header></Header>
    <Nav></Nav>
    <keep-alive>
      <router-view class="con"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import Header from "components/header/header";
import Nav from "components/nav/nav";
export default {
  name: "App",
  components: {
    Header,
    Nav
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
  padding-top: rem(88);
}
</style>
