<template>
  <div class="app">
    <musicList :title="title" :bg-image="bgImage" :songs="songs"></musicList>
  </div>

</template>

<script type="text/ecmascript-6">
import { mapGetters } from "vuex";
import { ERR_OK } from "api/config";
import musicList from "base/musicList/musicList";
import { getSongList } from "api/recommend";
import { recomSongList, createSong } from "assets/js/song";
export default {
  components: {
    musicList
  },
  computed: {
    title() {
      return this.disc.dissname;
    },
    bgImage() {
      return this.disc.imgurl;
    },
    ...mapGetters(["disc"])
  },
  data() {
    return {
      songs: []
    };
  },
  created() {
    this._getSongList();
  },
  methods: {
    _getSongList() {
      var that = this;
      if (!this.disc.dissid) {
        this.$router.push("/recommend");
        return;
      }
      getSongList(this.disc.dissid).then(res => {
        let ret = recomSongList(res);
        if (ret.code === ERR_OK) {
          that.songs = that._normalSongs(ret.cdlist[0].songlist);
        }
      });
    },
    _normalSongs(list) {
      let ret = [];
      list.forEach(musicData => {
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
