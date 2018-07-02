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
    <Scroll :data="songs" class="scroll" ref="scroll">
      <SongList @select="selectItem" @scrollRefresh="scrollRefresh" :songs="songs" :rank="rank"></SongList>
    </Scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import SongList from "base/songList/songList";
import Scroll from "base/scroll/scroll";
import { mapActions } from "vuex";
// import { getLyric, getVkey } from "api/song";
// import { ERR_OK } from "api/config";
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
  data() {
    return {
      vkey: "",
      item: "",
      index: ""
    };
  },
  methods: {
    // handlePlaylist(playlist) {
    //   const bottom = playlist.length > 0 ? "60px" : "";

    //   this.$refs.scroll.refresh();
    // },
    toBack: function() {
      this.$router.go(-1);
    },
    scrollRefresh() {
      this.$refs.scroll.refresh();
    },
    // _getLyric() {
    //   var that = this;
    //   // 传入当前点击的mid
    //   var mid = this.songs[this.index].mid;
    //   getLyric(that.songs.songmid).then(res => {
    //     if (res.code === ERR_OK) {
    //     }
    //   });
    //   getVkey(mid).then(res => {
    //     if (res.code === ERR_OK) {
    //       that.vkey = res.data.items[0].vkey;
    //       that.addMapActions(that.item, that.index);
    //     } else {
    //       console.log("musicList请求错误");
    //     }
    //   });
    // },
    selectItem(item, index) {
      this.index = index;
      this.item = item;
      this.addMapActions(this.item, this.index);
      // this._getLyric();
    },
    addMapActions(item, index) {
      var that = this;
      this.selectPlay({
        list: that.songs,
        index: index
        // vkey: that.vkey
      });
    },
    ...mapActions(["selectPlay"])
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
  // border-bottom:1px solid rgba(7, 17, 27, 0.4);
}
</style>
