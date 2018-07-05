<template>
  <div class="app">
    <musicList :title="title" :bg-image="bgImage" :songs="songs"></musicList>
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
  },
  methods: {
    _getDetail() {
      var that = this;
      if (!this.singer.id) {
        this.$router.go(-1);
        return;
      }
      // 使用singer.mid作为拼接url的请求路径
      getSingerDetail(that.singer.mid).then(res => {
        if (res.code === ERR_OK) {
          // 调用_normalizeSongs进行数据的封装处理
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
