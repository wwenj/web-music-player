<template>
  <div>
    <div class="search-input-box">
      <search-input ref="searchInput" @query="queryChange"></search-input>
    </div>
    <div class="hotkey">
      <h1 class="title">热门搜索</h1>
      <span class="hotCon" v-for="(item, index) in hotkey" :key="index">{{ item.k }}</span>
    </div>
    <div class="search-history">
      <h1 class="title">搜索历史</h1>
    </div>
    <!-- 查找显示歌曲 -->
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest ref="suggest" @listScroll="listBulr" :query="query"></suggest>
    </div>
    <!-- 歌手详情子路由 -->
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { ERR_OK } from "api/config";
import { getHotKey } from "api/search";
import searchInput from "base/searchInput/searchInput";
import suggest from "components/suggest/suggest";

export default {
  name: "Rank",
  components: {
    searchInput,
    suggest
  },
  data() {
    return {
      hotkey: [],
      query: ""
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
          console.log(this.hotkey);
        }
      });
    },
    queryChange(query) {
      this.query = query;
    },
    listBulr() {
      this.$refs.searchInput.blur();
    },
    ...mapMutations({
      setTopList: "SET_TOP_LIST"
    })
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
}
.hotkey {
  width: 100%;
  min-height: rem(136);
  max-height: rem(200);
  overflow: hidden;
  padding: 0 rem(20);
  box-sizing: border-box;
  margin: rem(30) 0 rem(20) 0;
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
</style>
