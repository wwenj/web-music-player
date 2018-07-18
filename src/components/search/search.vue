<template>
  <div>
    <div class="search-input-box">
      <search-input ref="searchInput" @query="queryChange" :query="query"></search-input>
    </div>
    <Scroll class="scroll" ref="scroll" :data="searchHistory">
      <div class="scroll-box">
        <div class="hotkey">
          <h1 class="title">热门搜索</h1>
          <span @click="hotkeyClick(item)" class="hotCon" v-for="(item, index) in hotkey" :key="index">{{ item.k }}</span>
        </div>
        <div class="search-history">
          <h1 class="title" v-show="searchHistory.length">搜索历史<img src="./del.png" alt="" @click="historyClear"></h1>
          <historyList @select="hotkeyClick1" :searchList="searchHistory"></historyList>
        </div>
      </div>
    </Scroll>
    <!-- 查找显示歌曲 -->
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest ref="suggest" @listScroll="listBulr" @select="saveSearch" :query="query"></suggest>
    </div>
    <!-- 歌手详情子路由 -->
    <transition name="fade">
      <router-view></router-view>
    </transition>
    <!-- 清空历史记录 -->
    <confirm ref="confirm" text="是否清空所有记录" @confirm="clearSearchHistory"></confirm>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from "vuex";
import { ERR_OK } from "api/config";
import { getHotKey } from "api/search";
import Scroll from "base/scroll/scroll";
import searchInput from "base/searchInput/searchInput";
import historyList from "base/historyList/historyList";
import confirm from "base/confirm/confirm";
import suggest from "components/suggest/suggest";

export default {
  name: "Rank",
  components: {
    searchInput,
    suggest,
    historyList,
    Scroll,
    confirm
  },
  data() {
    return {
      hotkey: [],
      query: "" // 当前搜索框内容
    };
  },
  created() {
    this._getHost();
  },
  methods: {
    _getHost() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotkey = res.data.hotkey.slice(0, 10);
        }
      });
    },
    queryChange(query) {
      this.query = query;
    },
    listBulr() {
      this.$refs.searchInput.blur();
    },
    hotkeyClick(item) {
      this.$refs.searchInput.queryHot(item.k);
    },
    // 保存当前点击列表到本地，形成历史记录
    saveSearch() {
      this.saveSearchHistory(this.query);
    },
    // 点击历史记录
    hotkeyClick1(item) {
      this.$refs.searchInput.queryHot(item);
    },
    // 更新历史记录页的scorll
    hisScorll() {
      this.$refs.scroll.refresh();
    },
    // 清空历史记录
    historyClear() {
      // this.clearSearchHistory();
      this.$refs.confirm.show();
    },
    ...mapMutations({
      setTopList: "SET_TOP_LIST"
    }),
    ...mapActions(["saveSearchHistory", "clearSearchHistory"])
  },
  computed: {
    ...mapGetters(["searchHistory"])
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "assets/css/mixin.scss";
.search-input-box {
  margin-top: rem(20);
  padding: 0 rem(20);
  box-sizing: border-box;
  margin-bottom: rem(30);
}
.hotkey {
  width: 100%;
  min-height: rem(136);
  max-height: rem(220);
  overflow: hidden;
  padding: 0 rem(20);
  box-sizing: border-box;
  margin: 0 0 rem(20) 0;
}
.title {
  color: rgba(255, 255, 255, 0.5);
  font-size: rem(15);
  margin-bottom: rem(20);
}
.hotCon {
  display: inline-block;
  padding: rem(5) rem(10);
  border-radius: rem(6);
  font-size: rem(14);
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: rem(10);
  margin-right: rem(20);
  background: rgb(51, 51, 51);
}
.search-history {
  width: 100%;
  padding: 0 rem(20);
  box-sizing: border-box;
}
.search-result {
  width: 100%;
  min-height: rem(400);
  background: rgb(34, 34, 34);
  position: absolute;
  top: rem(175);
}
/* 子路由进去动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter,
.fade-leave-to {
  transform: translate3d(100%, 0, 0);
}
.title img {
  width: rem(18);
  height: rem(18);
  float: right;
}
.scroll {
  width: 100%;
  height: 73vh;
  overflow: hidden;
}
.scroll-box {
  padding-bottom: rem(50);
}
</style>
