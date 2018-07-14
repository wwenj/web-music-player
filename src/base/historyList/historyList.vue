<template>
  <ul ref="historyUl">
    <li @click="selectItem(item)" class="listLi" v-for="(item, index) in searchList" :key="index">
      <p class="text">{{item}}</p>
      <img @click.stop="selectItemDel(item)" src="./sdel.png" alt="删除" title="删除">
    </li>
    <!-- <TopTip ref="topTip">
      <div class="tip-title">
        <span class="text">已从历史记录中删除</span>
      </div>
    </TopTip> -->
  </ul>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { playlistMixin } from "assets/js/mixin";
// import TopTip from "base/topTip/topTip";
export default {
  mixins: [playlistMixin],
  name: "historyList",
  props: {
    searchList: {
      type: Array
    }
  },
  components: {
    // TopTip
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "25px" : "";

      this.$refs.historyUl.style.paddingBottom = bottom;
      this.$emit("hisScorll");
    },
    selectItem(item) {
      // 点击搜索历史列表
      this.$emit("select", item);
    },
    selectItemDel(item) {
      // 点击某个历史列表叉号
      this.deleteSearchHistory(item);
      // this.$refs.topTip.show();
    },
    ...mapActions(["deleteSearchHistory"])
  },
  computed: {
    ...mapGetters(["searchHistory", "playlist"])
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "assets/css/mixin.scss";
.listUl {
  width: 100%;
}
.listLi {
  width: 100%;
  height: rem(40);
  color: rgba(255, 255, 255, 0.5);
  font-size: rem(16);
  line-height: rem(40);
}
.listLi img {
  width: rem(20);
  height: rem(20);
  float: right;
  margin-top: rem(10);
}
.text {
  display: inline-block;
}
// .tip-title {
//   text-align: center;
//   padding: rem(18) 0;
//   font-size: 0;
// }

// .tip-title .text {
//   font-size: rem(14);
//   color: #fff;
// }
</style>
