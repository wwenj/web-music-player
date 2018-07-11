<template>
  <transition name="list-fade">
    <div v-show="showFlag" class="playlist-box" @click="hide">
      <div class="playlist" @click.stop>
        <!-- 头部 -->
        <div class="list-header">
          <h1>
            <img v-if="modeText === '顺序播放'" src="./img/sequence.png" alt="顺序">
            <img v-if="modeText === '单曲循环'" src="./img/loop.png" alt="单曲">
            <img v-if="modeText === '随机播放'" src="./img/random.png" alt="随机">
            <span>{{modeText}}</span>
            <span class="del">
              <img src="./img/del.png" alt="清空">
            </span>
          </h1>
        </div>
        <!-- 歌曲列表 -->
        <Scroll class="list-con" :data="sequenceList" ref="listContent">
          <ul>
            <li v-for="(item, index) in sequenceList" :key="index">
              <div class="lihear-img-box">
                <img v-if="getCurrentIcon(item)" src="./img/playButton.png" alt="">
              </div>
              <p class="list2-con">{{ item.name }}</p>
              <div class="list-end">
                <img v-if="collect" src="./img/collect.png" alt="">
                <img v-else src="./img/collect2.png" alt="">
                <img class="cha" src="./img/smldel.png" alt="">
              </div>
            </li>
          </ul>
        </Scroll>
        <div class="list-operate">
          <div class="add-song">
            <img src="./img/songListAdd.png" alt="添加歌曲">
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div @click="hide" class="list-close">
          <span>关闭</span>
        </div>
      </div>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
import { mapGetters } from "vuex";
import { playMode } from "assets/js/config";
import Scroll from "base/scroll/scroll";
import Confirm from "base/confirm/confirm";
import { playerMixin } from "assets/js/mixin";

export default {
  mixins: [playerMixin],
  data() {
    return {
      showFlag: false,
      refreshDelay: 120,
      collect: true
    };
  },
  components: {
    Scroll,
    Confirm
  },
  computed: {
    modeText() {
      return this.mode === playMode.sequence
        ? "顺序播放"
        : this.mode === playMode.random ? "随机播放" : "单曲循环";
    },
    ...mapGetters(["sequenceList", "currentSong"])
  },
  methods: {
    show() {
      this.showFlag = true;
      setTimeout(() => { // dom渲染后再去计算
        this.$refs.listContent.refresh();
        this.scrollToCurrent(this.currentSong);
      }, 20);
    },
    hide() {
      this.showFlag = false;
    },
    /* 列表当前播放显示图标 */
    getCurrentIcon(item) {
      if (this.currentSong.id === item.id) {
        return true;
      }
      return false;
    },
    scrollToCurrent(current) {
      const index = this.sequenceList.findIndex(song => {
        return current.id === song.id;
      });
      this.$refs.listContent.scrollToElement(
        this.$refs.list.$el.children[index],
        300
      );
    },
    showConfirm() {},
    changeMode() {},
    selectItem() {},
    toggleFavorite() {},
    deleteOne() {},
    addSong() {}
  }
};
</script>

<style scoped lang="scss">
@import "assets/css/mixin.scss";
.playlist-box {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 500;
  background-color: rgba(0, 0, 0, 0.3);
}
.playlist {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  padding: rem(20) rem(30) rem(0) rem(20);
  background: #333333;
  box-sizing: border-box;
  font-size: rem(14);
}
.list-header {
  width: 100%;
  padding-bottom: rem(10);
  height: rem(30);
}
.list-header h1 {
  widows: 100%;
  height: 100%;
  color: hsla(0, 0%, 100%, 0.644);
}
.list-header h1 img {
  width: rem(30);
  height: rem(30);
  vertical-align: middle;
  margin-right: rem(10);
}
.list-header .del img {
  width: rem(20);
  height: rem(20);
}
.del {
  float: right;
}
.list-con {
  width: 100%;
  max-height: 35vh;
  overflow: hidden;
}
.list-con li {
  width: 100%;
  height: rem(40);
  line-height: rem(40);
  color: hsla(0, 0%, 100%, 0.5);
  overflow: hidden;
  position: relative;
}
.lihear-img-box {
  width: rem(14);
  height: rem(40);
  display: inline-block;
  margin-right: rem(5);
  vertical-align: top;
  line-height: rem(40);
}
.lihear-img-box img {
  width: rem(14);
  height: rem(14);
  vertical-align: middle;
}
.list2-con {
  display: inline-block;
  width: 70%;
}
.list-end {
  position: absolute;
  top: 0;
  right: 0;
  width: rem(60);
  height: rem(40);
  // line-height: rem(40);
  vertical-align: middle;
}
.list-end img {
  width: rem(15);
  height: rem(15);
  // margin-right: rem(12);
}
.cha {
  margin-left: rem(20);
}
.list-operate {
  width: rem(140);
  height: rem(30);
  margin: rem(20) auto;
  margin-bottom: rem(70);
}
.add-song {
  width: 100%;
  height: rem(30);
  box-sizing: border-box;
  padding: rem(8) rem(16);
  border: 1px solid hsla(0, 0%, 100%, 0.5);
  border-radius: rem(100);
  color: hsla(0, 0%, 100%, 0.5);
  font-size: rem(12);
}
.add-song img {
  width: rem(12);
  height: rem(12);
  vertical-align: middle;
}
.list-close {
  width: 100%;
  text-align: center;
  line-height: rem(50);
  background: #222;
  font-size: rem(16);
  color: hsla(0, 0%, 100%, 0.5);
  position: absolute;
  bottom: 0;
  left: 0;
}
.list-fade-enter {
  transform: translate3d(0, 100%, 0);
  opacity: 0;
}
.list-fade-leave-to {
  transform: translate3d(0, 100%, 0);
}
.list-fade-leave {
  opacity: 1;
}
.list-fade-enter-active,
.list-fade-leave-active {
  transition: all 0.3s;
}
</style>
