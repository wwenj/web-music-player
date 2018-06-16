<template>
  <div class="player" v-show="playlist.length>0">
    <!-- 全屏播放器 -->
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="normal-bg">
          <img :src="currentSong.image" alt="">
        </div>
        <div class="header">
          <img src="./toDown.png" alt="收回" title="收回" @click="toDown">
          <h1 v-html="currentSong.name"></h1>
        </div>
        <h1 class="title-singer" v-html="currentSong.singer"></h1>
        <!-- 旋转大头像 -->
        <div class="middle">
          <img :class="playing? 'playSrart' : 'playStorp'" :src="currentSong.image" alt="">
        </div>
        <!-- 控制按钮栏 -->
        <div class="bottom-button-box">
          <span><img src="./btnImg/sequence.png" alt=""></span>
          <span @click="prev"><img src="./btnImg/prve.png" alt=""></span>
          <span @click="togglePlaying">
            <img v-if="playing" id="playButton" src="./playStrop.png" alt="">
            <img v-if="!playing" id="playButton" src="./playButton.png" alt="">
          </span>
          <span @click="next"><img src="./btnImg/next.png" alt=""></span>
          <span><img src="./btnImg/collect.png" alt=""></span>
        </div>
        <audio ref="audio"></audio>
      </div>
    </transition>
    <!-- 收回的迷你播放器 -->
    <div class="mini-player" v-show="!fullScreen" @click="toUp">
      <div class="mini-player-con">
        <img :class="playing? 'playSrart' : 'playStorp'" :src="currentSong.image" alt="">
        <p>
          <span class="mini-title" v-html="currentSong.name"></span>
          <span class="mini-name" v-html="currentSong.singer"></span>
        </p>
        <div class="playButton-box">
          <span @click.stop="togglePlaying" class="playButton">
            <img v-if="playing" src="./playStrop.png" alt="">
            <img v-if="!playing" src="./playButton.png" alt="">
          </span>
          <span class="playList">
            <img src="./playList.png" alt="播放按钮" title="播放">
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import { songUrl } from "assets/js/song";
import { getVkey } from "api/song";
import { ERR_OK } from "api/config";
export default {
  computed: {
    ...mapGetters([
      "fullScreen",
      "playlist",
      "currentSong",
      "vkey",
      "playing",
      "currentIndex"
    ])
  },
  data() {
    return {
      songUrlData: "",
      vkeyData: ""
    };
  },
  mounted() {
    // this._songUrl();
  },
  methods: {
    /* 播放按钮点击 */
    togglePlaying() {
      this.setPlayingState(!this.playing);
    },
    toDown() {
      this.setFullScreen(false);
    },
    toUp() {
      this.setFullScreen(true);
    },
    /* 上一曲，下一曲 */
    next() {
      let index = this.currentIndex + 1;
      if (index === this.playlist.length) {
        index = 0;
      }
      this.setCurrentIndex(index);
      this.setPlayingState("true"); // 点击下一曲后自动播放
    },
    prev() {
      let index = this.currentIndex - 1;
      if (index === -1) {
        index = this.playlist.length - 1;
      }
      this.setCurrentIndex(index);
      this.setPlayingState("false");
    },
    /* 重新请求key */
    _getVkey(mid) {
      var that = this;
      getVkey(mid).then(res => {
        if (res.code === ERR_OK) {
          let vkey = res.data.items[0].vkey;
          that.setVkey(vkey); // 请求到的key添加到vuex
        } else {
          console.log("player组件 vkey请求错误");
        }
      });
    },
    /* 播放歌曲 */
    songPlay() {
      this.$refs.audio.src = this.songUrlData;
      this.$refs.audio.crossOrigin = this.anonymous;
      this.$refs.audio.play();
    },
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN", // 设置播放页显示
      setPlayingState: "SET_PLAYING_STATE", // 设置播放状态
      setCurrentIndex: "SET_CURRENT_INDEX", // 设置索引，引起当前播放歌曲变化
      setVkey: "SET_VKEY"
    })
  },
  watch: {
    vkey: function(val, oldVal) {
      this.songUrlData = songUrl(val, this.currentSong.mid);
      console.log(this.songUrlData);
      this.songPlay();
      // console.log(this.currentSong.mid)
    },
    // 检测当前播放歌曲变化
    currentSong() {
      this.$nextTick(() => {
        this._getVkey(this.currentSong.mid);
      });
    },
    // 检测播放状态
    playing(val) {
      this.$nextTick(() => {
        const audio = this.$refs.audio;
        val ? audio.play() : audio.pause();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "assets/css/mixin.scss";
.normal-player {
  color: #fff;
  z-index: 400;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgb(34, 34, 34);
}
.normal-bg {
  z-index: -1;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  opacity: 0.6;
  filter: blur(20px);
}
.normal-bg img {
  width: 100%;
  height: 100%;
}
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 410;
  width: 100%;
  height: rem(60);
  background: rgb(51, 51, 51);
  padding: rem(10) rem(10) rem(10) rem(20);
  box-sizing: border-box;
}
.mini-player-con {
  width: 100%;
  height: rem(40);
}
.mini-player-con img {
  width: rem(40);
  height: rem(40);
  border-radius: rem(40);
  margin-right: rem(5);
  vertical-align: middle;
}
.mini-player-con p {
  display: inline-block;
  max-width: rem(170);
  height: rem(40);
  overflow: hidden;
  vertical-align: middle;
}
.mini-title {
  display: block;
  font-size: rem(14);
  height: rem(20);
  color: #fff;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: rem(20);
}
.mini-name {
  display: block;
  font-size: rem(12);
  height: rem(20);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: rgba(255, 255, 255, 0.3);
  line-height: rem(20);
}
.playButton-box {
  width: rem(90);
  height: rem(40);
  float: right;
  padding-top: rem(5);
  box-sizing: border-box;
}
.playList img {
  border-radius: 0;
  width: rem(30);
  height: rem(30);
  float: right;
}
.playButton img {
  border-radius: 0;
  width: rem(32);
  height: rem(32);
}
.header {
  width: 100%;
  background-size: 100% auto;
  position: relative;
  transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
}
.header img {
  width: rem(30);
  height: rem(30);
  position: absolute;
  top: rem(10);
  left: rem(15);
}
.header h1 {
  width: 80%;
  overflow: hidden;
  margin: auto;
  height: rem(45);
  text-align: center;
  line-height: rem(45);
  font-size: rem(18);
}
.title-singer {
  width: 60%;
  height: rem(15);
  margin: auto;
  overflow: hidden;
  font-size: rem(15);
  text-align: center;
  margin-bottom: rem(25);
}
/* 大头像 */
.middle {
  width: 100%;
  height: rem(420);
  text-align: center;
}
.middle img {
  width: rem(300);
  height: rem(300);
  border-radius: rem(300);
  border: rem(10) solid hsla(0, 0%, 100%, 0.1);
}
/* 底部按钮 */
.bottom-button-box {
  width: 100%;
  height: rem(40);
  padding: 0 rem(38);
  box-sizing: border-box;
  position: absolute;
  bottom: rem(50);
  line-height: rem(40);
  display: flex;
  justify-content: space-between;
  transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
}
.bottom-button-box img {
  width: rem(33);
  height: rem(33);
  vertical-align: middle;
}
#playButton {
  width: rem(40);
  height: rem(40);
}
/* 动画 */
.normal-enter-active,
.normal-leave-active {
  transition: all 0.4s;
}
.normal-enter {
  opacity: 0;
  position: fixed;
  top: 0;
  left: 0;
}
.normal-leave-to {
  opacity: 0;
  top: 100%;
  left: -150%;
}
/* 唱片旋转 */
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  0% {
    transform: rotate(360deg);
  }
}
.playSrart {
  animation: rotate 20s linear infinite;
}
.playStorp {
  animation: rotate 20s linear infinite;
  -webkit-animation-play-state: paused;
}
</style>
