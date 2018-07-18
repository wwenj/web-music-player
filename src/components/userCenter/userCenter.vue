<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <img class="icon-back" src="./img/toBack.png" alt="返回">
      </div>
      <div class="switches-wrapper">
        <switches @switch="switchItem" :switches="switches" :currentIndex="currentIndex"></switches>
      </div>

      <div ref="playBtn" class="play-btn" @click="allPlay">
        <span class="text">播放列表全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="favoriteList" class="list-scroll" v-if="currentIndex===0" :data="favoriteList">
          <div class="list-inner1" v-if="favoriteList.length !== 0">
            <SongList :songs="favoriteList" :rank="false" @select="selectSong"></SongList>
          </div>
          <div class="no-result" v-else>暂无内容</div>
        </scroll>
        <scroll ref="playList" class="list-scroll" v-if="currentIndex===1" :data="playHistory">
          <div class="list-inner1" v-if="playHistory.length !== 0">
            <SongList :songs="playHistory" :rank="false" @select="selectSong"></SongList>
          </div>
          <div class="no-result" v-else>暂无内容</div>
        </scroll>
      </div>
      <!--
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div> -->
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import Switches from "base/switches/switches";
import Scroll from "base/scroll/scroll";
import SongList from "base/songList/songList";
// import NoResult from "base/no-result/no-result";
import Song from "assets/js/song";
import { mapGetters, mapActions, mapMutations } from "vuex";
// import { playlistMixin } from "assets/js/mixin";

export default {
  // mixins: [playlistMixin],
  data() {
    return {
      currentIndex: 0,
      switches: [
        {
          name: "我喜欢的"
        },
        {
          name: "最近听的"
        }
      ]
    };
  },
  computed: {
    // noResult() {
    //   if (this.currentIndex === 0) {
    //     return !this.favoriteList.length;
    //   } else {
    //     return !this.playHistory.length;
    //   }
    // },
    // noResultDesc() {
    //   if (this.currentIndex === 0) {
    //     return "暂无收藏歌曲";
    //   } else {
    //     return "你还没有听过歌曲";
    //   }
    // },
    ...mapGetters(["favoriteList", "playHistory"])
  },
  methods: {
    // handlePlaylist(playlist) {
    //   const bottom = playlist.length > 0 ? "60px" : "";
    //   this.$refs.listWrapper.style.bottom = bottom;
    //   this.$refs.favoriteList && this.$refs.favoriteList.refresh();
    //   this.$refs.playList && this.$refs.playList.refresh();
    // },
    switchItem(index) {
      // 跳转分页按钮
      this.currentIndex = index;
    },
    selectSong(song) {
      // 点击插入当前播放列表
      this.insertSong(new Song(song));
    },
    back() {
      this.$router.back();
    },
    allPlay() {
      if (this.currentIndex === 0) {
        if (this.favoriteList) {
          this.setSequenceList(this.favoriteList.slice());
          this.setPlayList(this.favoriteList.slice());
        }
      } else {
        if (this.playHistory) {
          this.setSequenceList(this.playHistory.slice());
          this.setPlayList(this.playHistory.slice());
        }
      }
      this.setCurrentIndex(0);
      this.setPlayingState(true);
    },
    ...mapActions(["insertSong", "randomPlay"]),
    ...mapMutations({
      setPlayList: "SET_PLAYLIST",
      setSequenceList: "SET_SEQUENCE_LIST",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayingState: "SET_PLAYING_STATE"
    })
  },
  components: {
    Switches,
    Scroll,
    SongList
    // NoResult
  }
};
</script>

<style scoped lang="scss">
@import "assets/css/mixin.scss";

.user-center {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background: #222;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}

.back {
  position: absolute;
  top: 0;
  left: rem(6);
  z-index: 50;
}
.icon-back {
  // display: block;
  // padding: rem(10);
  // font-size: rem(22);
  // color: #ffcd32;
  width: rem(30);
  height: rem(30);
  position: absolute;
  top: rem(15);
  left: rem(15);
}

.switches-wrapper {
  margin: rem(10) 0 rem(30) 0;
}
.play-btn {
  box-sizing: border-box;
  width: rem(135);
  padding: rem(9) 0;
  margin: 0 auto;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: rgba(255, 255, 255, 0.788);
  border-radius: rem(100);
  font-size: 0;
}

.text {
  display: inline-block;
  vertical-align: middle;
  font-size: rem(12);
}
.list-wrapper {
  position: absolute;
  top: rem(105);
  bottom: 0;
  width: 100%;
}

.list-scroll {
  height: 100%;
  overflow: hidden;
}

.list-inner {
  padding: rem(20) rem(30);
}

.no-result-wrapper {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
.no-result {
  text-align: center;
  margin-top: 40%;
  font-size: rem(20);
  color: hsla(0, 0%, 100%, 0.4);
}
</style>
