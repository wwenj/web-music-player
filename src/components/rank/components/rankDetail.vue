<template>
  <div class="app">
    <musicList :title="title" :bg-image="bgImage" :songs="songs" :rank="true"></musicList>
  </div>

</template>

<script type="text/ecmascript-6">
import { mapGetters } from "vuex";
import { ERR_OK } from "api/config";
import musicList from "base/musicList/musicList";
import { getMusicList } from "api/rank";
import { createSong } from "assets/js/song";
export default {
  components: {
    musicList
  },
  computed: {
    title() {
      return this.topList.topTitle;
    },
    bgImage() {
      return this.topList.picUrl;
    },
    ...mapGetters(["topList"])
  },
  data() {
    return {
      songs: []
    };
  },
  created() {
    this._getTopList();
  },
  methods: {
    _getTopList() {
      var that = this;
      if (!this.topList.id) {
        this.$router.push("/rank");
        return;
      }
      getMusicList(this.topList.id).then(res => {
        if (res.code === ERR_OK) {
          that.songs = that._normalSongs(res.songlist);
        }
      });
    },
    _normalSongs(list) {
      let ret = [];
      list.forEach(item => {
        const musicData = item.data;
        if (musicData.songid && musicData.albummid) {
          // 必须有id和连接码
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  }
};
</script>

<style scoped lang="scss">
@import "assets/css/mixin.scss";
.app {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgb(34, 34, 34);
  z-index: 301;
}
</style>
