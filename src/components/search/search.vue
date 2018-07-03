<template>
  <div>
    <div class="search-input">
      <search-input ref="searchBox" @query="queryChange"></search-input>
    </div>
    <div class="hotkey">
      <h1 class="title">热门搜索</h1>
      <span class="hotCon" v-for="(item, index) in hotkey" :key="index">{{ item.k }}</span>
    </div>
    <div class="search-history">
      <h1 class="title">热门搜索</h1>
    </div>

    <div class="search-result" v-show="query" ref="searchResult">
      <suggest ref="suggest" :query="query"></suggest>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import Scroll from "base/scroll/scroll";
import { ERR_OK } from "api/config";
import { getHotKey } from "api/search";
import searchInput from "base/searchInput/searchInput";
import suggest from "components/suggest/suggest";

export default {
  name: "Rank",
  components: {
    Scroll,
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
    ...mapMutations({
      setTopList: "SET_TOP_LIST"
    })
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "assets/css/mixin.scss";
.search-input {
  margin-top: rem(20);
  padding: 0 rem(20);
  box-sizing: border-box;
}
.hotkey {
  width: 100%;
  height: rem(136);
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
</style>
