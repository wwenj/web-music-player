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
        <div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend="middleTouchEnd">
          <img :class="playImg" :src="currentSong.image" alt="">
          <p :class="playImgTxt" class="cd-lyric">
            {{playingLyric}}
          </p>
          <scroll class="middle-r middleTime" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" class="text" :class="{'current': currentLineNum ===index}" v-for="(line, index) in currentLyric.lines" :key="index">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <!-- 歌词旋转图像轮播 -->
        <div class="dot-wrapper">
          <span class="dot" :class="{'active':currentShow==='cd'}"></span>
          <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
        </div>
        <!-- 播放进度条 -->
        <div class="time-box">
          <div class="time">
            <span class="time-l">{{ format(currentTime) }}</span>
            <progressBar style="overflow:hidden" :percent="percent" @percentChange="percentChange"></progressBar>
            <span class="time-r">{{ format(currentSong.duration) }}</span>
          </div>
        </div>
        <!-- 控制按钮栏 -->
        <div class="bottom-button-box">
          <span @click="changeMode">
            <img v-if="mode === 2" src="./btnImg/random.png" alt="">
            <img v-if="mode === 0" src="./btnImg/sequence.png" alt="">
            <img v-if="mode === 1" src="./btnImg/loop.png" alt="">
          </span>
          <span @click="prev"><img src="./btnImg/prve.png" alt=""></span>
          <span @click="togglePlaying">
            <img v-if="playing" id="playButton" src="./playStrop.png" alt="">
            <img v-if="!playing" id="playButton" src="./playButton.png" alt="">
          </span>
          <span @click="next"><img src="./btnImg/next.png" alt=""></span>
          <span @click="toggleFavoriteList(currentSong)">
            <img v-if="getFavoriteListCollect(currentSong)" src="./btnImg/collect.png" alt="收藏">
            <img v-else src="./btnImg/collect2.png" alt="收藏">
          </span>
        </div>
        <!-- 音乐播放器 -->
        <audio ref="audio" @canplay="audioReady" @error="audioError" @timeupdate="timeUpdate" @ended="songEnd"></audio>
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
          <span class="playList" @click.stop="playListClick">
            <img src="./playList.png" alt="播放按钮" title="播放">
          </span>
        </div>
      </div>
    </div>
    <!-- 查看播放歌曲列表 -->
    <playList ref="playList"></playList>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { songUrl } from "assets/js/song";
import { shuffle } from "assets/js/util";
import { getVkey, getLyric } from "api/song";
import { ERR_OK } from "api/config";
import progressBar from "./components/progress-bar";
import playList from "components/playList/playList";
import { playMode } from "assets/js/config";
import { Base64 } from "js-base64";
import Lyric from "lyric-parser";
import Scroll from "base/scroll/scroll";

export default {
  components: {
    progressBar,
    Scroll,
    playList
  },
  computed: {
    ...mapGetters([
      "fullScreen",
      "playlist",
      "currentSong",
      "vkey",
      "playing",
      "currentIndex",
      "mode",
      "sequenceList",
      "favoriteList" // 收藏
    ]),
    percent() {
      return this.currentTime / this.currentSong.duration;
    },
    playImg() {
      let class1 = this.playing ? "playSrart" : "playStorp";
      let class2 = this.currentShow === "lyric" ? "playImg" : "";
      return `${class1} ${class2}`;
    },
    playImgTxt() {
      let class2 = this.currentShow === "lyric" ? "playImg" : "";
      return `${class2}`;
    }
  },
  data() {
    return {
      songUrlData: "",
      vkeyData: "",
      songReadey: false, // 能否跳转下一曲
      currentTime: "",
      currentLyric: null, // 封装后的歌词对象
      currentShow: "cd", // 轮播图底部导航
      currentLineNum: 0, // 当前下显示歌词行数
      playingLyric: "" // 当前cd页显示歌词
    };
  },
  created() {
    this.touch = {};
  },
  mounted() {
    // this._songUrl();
  },
  methods: {
    // 收藏显示
    getFavoriteListCollect(song) {
      if (this.isFavoriteList(song)) {
        return false;
      } else {
        return true;
      }
    },
    // 点击收藏
    toggleFavoriteList(song) {
      if (this.isFavoriteList(song)) {
        this.deleteFavoriteList(song);
      } else {
        this.saveFavoriteList(song);
      }
    },
    // 判断当前播放歌曲是否收藏
    isFavoriteList(song) {
      const index = this.favoriteList.findIndex(item => {
        return item.id === song.id;
      });
      return index > -1;
    },
    /* 点击播放列表 */
    playListClick() {
      this.$refs.playList.show();
    },
    /* 播放按钮点击 */
    togglePlaying() {
      // 停止/播放当前歌词播放
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
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
      if (!this.songReadey) {
        return;
      }
      if (this.playlist.length === 1) {
        this.songLoop();
      } else {
        let index = this.currentIndex + 1;
        if (index === this.playlist.length) {
          index = 0;
        }
        this.setCurrentIndex(index);
        this.setPlayingState("true"); // 点击下一曲后自动播放
      }
      this.songReadey = false;
    },
    prev() {
      if (!this.songReadey) {
        return;
      }
      if (this.playlist.length === 1) {
        this.songLoop();
      } else {
        let index = this.currentIndex - 1;
        if (index === -1) {
          index = this.playlist.length - 1;
        }
        this.setCurrentIndex(index);
        this.setPlayingState("false");
      }
      this.songReadey = false;
    },
    /* 歌曲加载成功 */
    audioReady() {
      this.songReadey = true; // 当前歌曲还未加载完成时禁止跳转其他歌曲
      this.savePlayHistory(this.currentSong); // 播放歌曲存入本地播放记录
    },
    audioError() {
      console.log("当前歌曲加载失败，请尝试其他歌曲");
      this.songReadey = true; // 歌曲加载失败是不会阻塞其他歌曲播放
    },
    /* 音频播放时间更新 */
    timeUpdate(e) {
      this.currentTime = e.target.currentTime;
      // console.log(this.currentTime)
    },
    /* 歌曲进度条触摸后改变歌曲播放进度 */
    percentChange(precent) {
      const currentTime = this.currentSong.duration * precent;
      this.$refs.audio.currentTime = currentTime;
      // 歌词跟随进度条滚动
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000);
      }
    },
    /* 封装歌曲当前播放时间 */
    format(interval) {
      interval = interval | 0;
      var min = (interval / 60) | 0;
      var sec = interval % 60;
      if (sec.toString().length === 1) {
        sec = `0${sec}`;
      }
      return `${min}:${sec}`;
    },
    /* 改变播放顺序 */
    changeMode() {
      const mode = (this.mode + 1) % 3; // 取余
      this.setPlayMode(mode);
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.setPlayList(list);
    },
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
    /* 歌曲播放完毕 */
    songEnd() {
      if (this.mode === playMode.loop) {
        this.songLoop();
      } else {
        this.next();
      }
    },
    /* 单曲循环播放调会播放初始 */
    songLoop() {
      // 单曲循环播放结束歌词回到初始位置
      if (this.currentLyric) {
        this.currentLyric.seek(0);
      }
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
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
      /* 获取歌词 */
      getLyric(mid).then(res => {
        this.currentLyric = null;
        if (res.code === ERR_OK) {
          let lyric = Base64.decode(res.lyric);
          this.currentLyric = new Lyric(lyric, this.handleLyric);
          if (this.playing) {
            // 如果此时正在播放则歌词也开始播放
            this.currentLyric.play();
          }
        } else {
          console.log("player组件 Lyric请求错误");
          this.currentLyric = null;
          this.playingLyric = "";
          this.currentLineNum = 0;
        }
      });
    },
    handleLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum;
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5];
        this.$refs.lyricList.scrollToElement(lineEl, 1000);
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
      this.playingLyric = txt;
    },
    /* 播放歌曲 */
    songPlay() {
      this.$refs.audio.src = this.songUrlData;
      this.$refs.audio.crossOrigin = this.anonymous;
      this.$refs.audio.play();
    },
    /* 旋转头像歌词左右滑动 */
    middleTouchStart(e) {
      this.touch.initiated = true;
      // 用来判断是否是一次移动
      this.touch.moved = false;
      const touch = e.touches[0];
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pageY;
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const touch = e.touches[0];
      const deltaX = touch.pageX - this.touch.startX;
      const deltaY = touch.pageY - this.touch.startY;
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        // 上下滑动大于左右滑动判定为上下滑动
        return;
      }
      if (!this.touch.moved) {
        this.touch.moved = true;
      }
      /* 判断滑动方向 */
      if (deltaX > 0) {
        // 向右滑动//在歌词界面进行
        if (this.currentShow === "lyric") {
          this.touch.toChange = Math.abs(deltaX) > 40 ? "NO" : "OK";
        } else {
          return "";
        }
      } else {
        // 向左滑动//在CD界面进行
        if (this.currentShow === "cd") {
          this.touch.toChange = Math.abs(deltaX) > 40 ? "OK" : "NO"; // 如果滑动距离大判定为滑动事件
        } else {
          return "";
        }
      }
    },
    middleTouchEnd() {
      if (!this.touch.moved) {
        return;
      }
      if (this.touch.toChange === "OK") {
        this.$refs.lyricList.$el.style.transform = `translate3d(0px,0,0)`;
        this.currentShow = "lyric";
      } else {
        this.$refs.lyricList.$el.style.transform = `translate3d(375px,0,0)`;
        this.currentShow = "cd";
      }
    },
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN", // 设置播放页显示
      setPlayingState: "SET_PLAYING_STATE", // 设置播放状态
      setCurrentIndex: "SET_CURRENT_INDEX", // 设置索引，引起当前播放歌曲变化
      setVkey: "SET_VKEY",
      setPlayMode: "SET_PLAY_MODE",
      setPlayList: "SET_PLAYLIST"
    }),
    ...mapActions(["savePlayHistory", "saveFavoriteList", "deleteFavoriteList"])
  },
  watch: {
    vkey: function(val, oldVal) {
      this.songUrlData = songUrl(val, this.currentSong.mid);
      console.log(this.songUrlData);
      this.songPlay();
      // console.log(this.currentSong.mid)
    },
    // 检测当前播放歌曲变化
    currentSong(newSong, oldSong) {
      if (!newSong.id) {
        // 当清空播放列表时，newSong为空，则直接跳过下面操作
        return;
      }
      if (newSong === oldSong) {
        // 当currentSong播放列表因为点击播放方式改变时，不做操作
        return;
      }
      // 清除当前歌词自动跳转计时
      if (this.currentLyric) {
        this.currentLyric.stop();
      }
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
  height: 64%;
  text-align: center;
  overflow: hidden;
  position: relative;
}
.middle img {
  width: rem(300);
  height: rem(300);
  border-radius: rem(300);
  border: rem(10) solid hsla(0, 0%, 100%, 0.1);
  opacity: 1;
  transition: all 0.5s;
}
/* 底部按钮 */
.bottom-button-box {
  width: 100%;
  height: rem(40);
  padding: 0 rem(38);
  box-sizing: border-box;
  position: absolute;
  bottom: 7%;
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
/* 播放进度条 */
.time-box {
  width: 100%;
  height: rem(30);
  margin: auto;
  position: fixed;
  bottom: 12%;
  padding: rem(10) 0;
}
.time {
  width: rem(300);
  height: rem(30);
  margin: auto;
  display: flex;
  justify-content: space-between;
}
.time span {
  display: inline-block;
  width: rem(30);
  height: rem(30);
  line-height: rem(30);
  font-size: rem(12);
}
.time-l {
  padding-right: rem(7);
}
.time-r {
  padding-left: rem(7);
}
/* 底部轮播导航 */
.dot-wrapper {
  width: 100%;
  height: rem(8);
  position: fixed;
  bottom: 22%;
  text-align: center;
}
.dot {
  display: inline-block;
  width: rem(8);
  height: rem(8);
  border-radius: rem(8);
  background: hsla(0, 0%, 100%, 0.5);
  transition: all 0.5s;
}
.active {
  width: rem(20);
  transition: all 0.5s;
  background: hsla(0, 0%, 100%, 0.8);
}
/* 歌词部分 */
.lyric-wrapper {
  width: 80%;
  margin: 0 auto;
  overflow: hidden;
  text-align: center;
}
.text {
  line-height: rem(32);
  color: hsla(0, 0%, 100%, 0.5);
  font-size: rem(14);
  overflow: hidden;
}
.current {
  color: #fff;
  font-size: rem(16);
}
.middle-r {
  width: 100%;
  height: 64%;
  float: left;
  transform: translate3d(rem(375), 0, 0);
  position: absolute;
  top: 0;
}
.middleTime {
  transition: transform 0.5s;
}
/* 滑动到歌词界面隐藏旋转头像 */
.middle .playImg {
  opacity: 0;
  transition: all 0.5s;
}
.cd-lyric {
  width: 80%;
  margin: 0 auto;
  overflow: hidden;
  text-align: center;
  color: hsla(0, 0%, 100%, 0.589);
  font-size: rem(16);
  line-height: rem(32);
  height: rem(40);
  margin-top: 5%;
}
</style>
