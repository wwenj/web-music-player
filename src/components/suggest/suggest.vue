<template>
  <div class="search-input">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <!-- <loading v-show="hasMore" title=""></loading> -->
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
import { search } from "api/search";
import { ERR_OK } from "api/config";
import { createSong } from "assets/js/song";
// import { Singer } from "assets/js/singer";

const TYPE_SINGER = "Singer";
export default {
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
      result: ""
    };
  },
  methods: {
    search() {
      search(this.query, this.query, this.showSinger).then(res => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data);
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
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name}-${item.singer}`;
      }
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return "icon-mine";
      } else {
        return "icon-music";
      }
    }
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
</style>
