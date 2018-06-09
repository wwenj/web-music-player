<template>
  <div class="app">
    <div class="bg-box" :style="bgStyle">
      <div class="header" :style="bgStyle">
        <div class="header-filter">
          <img src="./toBack.png" alt="返回" title="返回" @click="toBack">
          <h1 v-html="title"></h1>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <Scroll :data="songs" class="scroll">
      <SongList :songs="songs" :rank="false"></SongList>
    </Scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import SongList from "base/songList/songList";
import Scroll from "base/scroll/scroll";
export default {
  components: {
    SongList,
    Scroll
  },
  props: {
    bgImage: {
      type: String,
      default: ""
    },
    songs: {
      type: Array
      // default: ""
    },
    title: {
      type: String,
      default: ""
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toBack: function() {
      this.$router.push("/singer");
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    }
  }
};
</script>

<style scoped lang="scss">
@import "assets/css/mixin.scss";
.app {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgb(34, 34, 34);
  z-index: 301;
  color: #fff;
}
.header {
  width: 100%;
  background-size: 100% auto;
  position: relative;
  z-index: 300;
}
.header img {
  width: rem(30);
  height: rem(30);
  position: absolute;
  top: rem(10);
  left: rem(15);
}
.header h1 {
  width: 100%;
  height: rem(45);
  text-align: center;
  line-height: rem(45);
  font-size: rem(18);
}
.bg-box {
  width: 100%;
  height: 39vh;
  background-size: 100% auto;
  position: relative;
}
.filter {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(7, 17, 27, 0.4);
}
.scroll {
  width: 100%;
  height: 61vh;
}
.header-filter {
  width: 100%;
  height: 100%;
  background: rgba(7, 17, 27, 0.4);
  // background: red;
}
</style>
