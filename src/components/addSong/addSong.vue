<template>
  <transition name="slide">
    <div class="add-song1" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <img src="./img/songClose.png" alt="关闭">
        </div>
      </div>
      <div class="search-box-wrapper">
        <searchInput ref="searchInput" @query="onQueryChange" placeholder="搜索歌曲"></searchInput>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
        <div class="list-wrapper">
          <!-- 播放历史 -->
          <scroll ref="songList" v-if="currentIndex===0" class="list-scroll" :data="playHistory">
            <div class="list-inner">
              <SongList :songs="playHistory" @select="selectSong" :rank="false">
              </SongList>
            </div>
          </scroll>
          <!-- 搜索历史 -->
          <scroll ref="searchList" v-if="currentIndex===1" class="list-scroll" :data="searchHistory">
            <div class="list-inner2">
              <historyList @select="addQuery" :searchList="searchHistory"></historyList>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query" :showSinger="showSinger" @select="selectSuggest" @listScroll="listBulr"></suggest>
      </div>
      <!-- 弹出提示层插槽 -->
      <TopTip ref="topTip">
        <div class="tip-title">
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </TopTip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import SearchInput from "base/searchInput/searchInput";
import SongList from "base/songList/songList";
import historyList from "base/historyList/historyList";
import Scroll from "base/scroll/scroll";
import Switches from "base/switches/switches";
import TopTip from "base/topTip/topTip";
import Suggest from "components/suggest/suggest";
// import { searchMixin } from "assets/js/mixin";
import { mapGetters, mapActions } from "vuex";
import Song from "assets/js/song";

export default {
  // mixins: [searchMixin],
  data() {
    return {
      showFlag: false, // 本组件显示
      query: "",
      showSinger: false, // 不搜索歌手
      currentIndex: 0, // 最近播放高亮
      songs: [],
      switches: [
        {
          name: "最近播放"
        },
        {
          name: "搜索历史"
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["playHistory", "searchHistory"])
  },
  methods: {
    show() {
      this.showFlag = true;
      setTimeout(() => {
        if (this.currentIndex === 0) {
          // 因为v-show，异步更新dom
          this.$refs.songList.refresh();
        } else {
          this.$refs.searchList.refresh();
        }
      }, 20);
    },
    hide() {
      this.showFlag = false;
    },
    selectSong(song, index) {
      // 点击播放历史歌曲
      if (index !== 0) {
        // 第一条就是正在播放的肯定不需要插入当前播放列表
        this.insertSong(new Song(song)); // 把song对象存到vuex
        this.$refs.topTip.show();
      }
    },
    // 搜索结果插入播放列表
    selectSuggest() {
      this.$refs.topTip.show();
      this.saveSearch();
    },
    // 变化左右按钮
    switchItem(index) {
      this.currentIndex = index;
    },
    // input用户输入变化
    onQueryChange(query) {
      this.query = query;
    },
    // 保存当前点击列表到本地，形成历史记录
    saveSearch() {
      this.saveSearchHistory(this.query);
    },
    // input失焦
    listBulr() {
      this.$refs.searchInput.blur();
    },
    // 点击搜索记录放到搜索框
    addQuery(item) {
      this.$refs.searchInput.queryHot(item);
    },
    deleteSearchHistory() {},
    ...mapActions(["insertSong", "saveSearchHistory", "clearSearchHistory"])
  },
  components: {
    SearchInput,
    SongList,
    historyList,
    Scroll,
    Switches,
    TopTip,
    Suggest
  }
};
</script>

<style scoped lang="scss">
@import "assets/css/mixin.scss";

.add-song1 {
  width: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 600;
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

.header {
  position: relative;
  height: rem(44);
  text-align: center;
}

.title {
  line-height: rem(44);
  font-size: rem(18);
  color: #fff;
}

.close {
  position: absolute;
  top: rem(12);
  right: rem(15);
}
.close img {
  width: rem(20);
  height: rem(20);
}

.icon-close {
  display: block;
  padding: rem(12);
  font-size: rem(20);
  color: #ffcd32;
}

.search-box-wrapper {
  margin: rem(20);
}

.shortcut .list-wrapper {
  position: absolute;
  top: rem(165);
  bottom: 0;
  width: 100%;
}

.shortcut .list-scroll {
  height: 100%;
  overflow: hidden;
}

.search-result {
  position: fixed;
  top: rem(124);
  bottom: 0;
  width: 100%;
}

.tip-title {
  text-align: center;
  padding: rem(18) 0;
  font-size: 0;
}

.tip-title .text {
  font-size: rem(14);
  color: #fff;
}
.list-inner2 {
  padding: rem(20) rem(30);
  box-sizing: border-box;
}
</style>
