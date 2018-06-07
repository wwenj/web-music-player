<template>
  <div class="app">
    <musicList :title="title" :bg-image="bgImage" :songs="songs"></musicList>
    <!-- loading -->
  </div>

</template>

<script type="text/ecmascript-6">
import { mapGetters } from "vuex";
import { getSingerDetail } from "api/singer";
import { ERR_OK } from "api/config";
import { createSong } from "assets/js/song";
import musicList from "base/musicList/musicList";
export default {
  components: {
    musicList
  },
  computed: {
    title() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.img;
    },
    ...mapGetters(["singer"])
  },
  data() {
    return {
      songs: []
    };
  },
  created() {
    this._getDetail();
    console.log(this.singer);
  },
  methods: {
    _getDetail() {
      var that = this;
      // if (!this.singer.id) {
      //   this.$router.push("/singer");
      //   return;
      // }
      console.log(that.singer.id);
      getSingerDetail(that.singer.mid).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list);
          // console.log(this.songs);
        }
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(item => {
        let { musicData } = item;
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
