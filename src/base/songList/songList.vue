<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song, index)" class="item" v-for="(song, index) in songs" :key="index">
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
    <div class="loading" v-show="songs.length === 0?1:0">
      <loading></loading>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import loading from "base/loading/loading";
export default {
  components: {
    loading
  },
  props: {
    songs: {
      type: Array
      // default: []
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selectItem(item, index) {
      this.$emit("select", item, index);
    },
    getDesc(song) {
      return `${song.singer}·${song.album}`;
    },
    getRankCls(index) {
      if (index <= 2) {
        return `icon icon${index}`;
      } else {
        return "text";
      }
    },
    getRankText(index) {
      if (index > 2) {
        return index + 1;
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "assets/css/mixin.scss";
.song-list {
  width: 100%;
  box-sizing: border-box;
  padding: rem(20) rem(30);
  position: relative;
}
.rank {
  float: left;
}
.item {
  width: 100%;
  box-sizing: border-box;
  height: rem(64);
}
.text {
  display: inline-block;
  width: rem(25);
  height: rem(24);
  margin-right: rem(30);
  color: #ffcd32;
  font-size: rem(18);
  text-align: center;
}
.icon {
  display: inline-block;
  width: rem(25);
  height: rem(24);
  background-size: rem(25) rem(24);
  margin-right: rem(30);
}
.icon0 {
  background-image: url("./first@3x.png");
}
.icon1 {
  background-image: url("./second@3x.png");
}
.icon2 {
  background-image: url("./third@3x.png");
}
.content {
  width: 100%;
  color: #fff;
  font-size: rem(15);
  float: left;
}
.name {
  width: 90%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: rem(10);
}
.desc {
  width: 90%;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: rem(10);
  color: rgba(255, 255, 255, 0.3);
}
.loading {
  position: fixed;
  width: 100%;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}
</style>
