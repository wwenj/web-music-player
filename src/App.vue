<template>
  <div id="app">
    <Header></Header>
    <Nav></Nav>
    <router-view></router-view>
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
</style>
