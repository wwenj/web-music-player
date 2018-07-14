<template>
  <div class="header">
    <div class="header-con">
      <img src="./logo.png" alt="logo">
      <span class="title">Listen World</span>
    </div>
    <router-link to="/user" class="icon-mine" tag="span">
      <img src="./icon-mine.png" alt="">
    </router-link>

  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {};
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "~assets/css/mixin.scss";
.header {
  width: 100%;
  height: rem(44);
  background: rgb(34, 34, 34);
  // line-height: rem(40);
  text-align: center;
  // position: fixed;
  position: relative;
  // top: 0;
  // left: 0;
  padding-top: rem(5);
  box-sizing: border-box;
  z-index: 100;
}
.header-con {
  display: inline;
  margin: auto;
}
img {
  display: inline-block;
  width: rem(30);
  height: rem(32);
  vertical-align: rem(10);
}
.title {
  color: #ffcd32;
  // vertical-align: middle;
  vertical-align: rem(16);
  font-size: rem(18);
  margin-left: rem(5);
}
.icon-mine {
  width: rem(44);
  height: rem(44);
  line-height: rem(44);
  text-align: center;
  position: absolute;
  top: 0;
  right: 0;
}
.icon-mine img {
  width: rem(25);
  height: rem(25);
  vertical-align: middle;
}
</style>
