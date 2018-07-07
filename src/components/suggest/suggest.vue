<template>
  <Scroll ref="scroll" :data="result" class="search-input" :pullup="pullup" :beforeScroll="beforeScroll" @scrollToEnd="serachMove" @beforeScroll="listScroll">
    <ul class="suggest-list"  ref="searchUi">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <img v-if="getIconCls(item)" src="./people.png" alt="">
          <img v-if="!getIconCls(item)" src="./music.png" alt="">
        </div>
        <p class="name" v-html="getDisplayName(item)"></p>
      </li>
      <loading v-show="hasMove" title=""></loading>
      <p class="lodAuto" v-show="!hasMove">(^_^) 已全部加载</p>
    </ul>
  </Scroll>
</template>

<script type="text/ecmascript-6">
import { search } from "api/search";
import { ERR_OK } from "api/config";
import { createSong } from "assets/js/song";
import Scroll from "base/scroll/scroll";
import loading from "base/loading/loading";
import Singer from "assets/js/singer";
import { mapMutations, mapActions } from "vuex";
import { playlistMixin } from "assets/js/mixin";

const TYPE_SINGER = "Singer"; // 为歌手
const perpage = 30; // 每次访问条数
export default {
  mixins: [playlistMixin],
  components: {
    Scroll,
    loading
  },
  props: {
    query: {
      type: String,
      default: ""
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      pullup: true, // 是否派发下拉事件
      beforeScroll: true, // 是否派发滚动前事件
      hasMove: false
    };
  },
  methods: {
    handlePlaylist(playlist) {
      if (this.$refs.searchUi) {
        const bottom = playlist.length > 0 ? "60px" : "";

        this.$refs.searchUi.style.paddingBottom = bottom;
        this.$refs.scroll.refresh();
      }
    },
    search() {
      this.hasMove = true;
      this.page = 1; // 更新输入请求从第一页开始
      this.$refs.scroll.scrollTo(0, 0); // 更新输入后回到滚动顶部
      /* 用户输入，请求页码，，请求条数 */
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data);
          this._checkMore(res.data);
        }
      });
    },
    /* 封装数据 */
    _genResult(data) {
      let ret = [];
      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } });
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list));
      }
      return ret;
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(musicData => {
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
    /* 判断是否为歌手 非歌手显示 */
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name}-${item.singer}`;
      }
    },
    /* 判断是否为歌手 */
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        // 判断此条数据是否为歌手，为Singer
        return true;
      } else {
        return false;
      }
    },
    /* 判断当前是否已经加载全部内容 */
    _checkMore(data) {
      const song = data.song;
      if (
        !song.list.length ||
        song.curnum + song.curpage * perpage > song.totalnum
      ) {
        this.hasMove = false;
      }
    },
    serachMove() {
      if (!this.hasMove) {
        return;
      }
      this.page++; // 下拉加载，请求页数增加
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._genResult(res.data));
          this._checkMore(res.data);
        }
      });
    },
    /* 跳转歌手/播放 */
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        // 如果为歌手
        const singer = new Singer({
          id: item.singerid,
          mid: item.singermid,
          name: item.singername
        });
        this.setSinger(singer);
        this.$router.push({
          path: `/search/${singer.id}`
        });
      } else {
        // 如果是歌曲直接改变当前播放列表
        this.insertSong(item);
      }
      this.$emit("select")
    },
    /* 滚动前事件，解决移动端键盘收起问题 */
    listScroll() {
      this.$emit("listScroll");
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    }),
    ...mapActions({
      insertSong: "insertSong"
    })
  },
  watch: {
    query() {
      this.search();
    }
  }
};
</script>
<style scoped lang="scss">
@import "assets/css/mixin.scss";
.search-input {
  width: 100%;
  padding: 0 rem(30);
  box-sizing: border-box;
  color: rgba(255, 255, 255, 0.3);
  font-size: rem(14);
  height: 73vh;
  overflow: hidden;
}
.suggest-item {
  width: 100%;
  height: rem(16);
  overflow: hidden;
  padding-bottom: rem(20);
}
.icon {
  display: inline-block;
  width: rem(25);
  height: rem(16);
}
.icon img {
  width: rem(16);
  height: rem(15);
  vertical-align: middle;
}
.name {
  display: inline-block;
  width: 85%;
  height: rem(16);
  line-height: rem(16);
  vertical-align: middle;
  overflow: hidden;
}
.lodAuto {
  text-align: center;
  margin-top: rem(10);
  color: rgba(206, 209, 212, 0.849);
  border-top: 1px solid rgba(255, 255, 255, 0.082);
  line-height: rem(40);
}
</style>
