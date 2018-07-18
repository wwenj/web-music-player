<template>
  <scroll :data="topList" class="toplist" ref="toplist">
    <ul ref="rank">
      <li @click="selectItem(item)" class="item" v-for="(item, index) in topList" :key="index">
        <div class="icon">
          <img v-lazy="item.picUrl"/>
        </div>
        <ul class="songlist">
          <li class="song" v-for="(song,index) in item.songList" :key="index">
            <span>{{index + 1}}</span>
            <span>{{song.songname}}-{{song.singername}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="loading-container" v-show="!topList.length">
      <loading></loading>
    </div>
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </scroll>
</template>

<script>
import { mapMutations } from "vuex";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import { getTopList } from "api/rank";
import { ERR_OK } from "api/config";
import { playlistMixin } from "assets/js/mixin";
export default {
  name: "Rank",
  mixins: [playlistMixin],
  components: {
    Scroll,
    Loading
  },
  data() {
    return {
      topList: []
    };
  },
  created() {
    this._getTopList();
  },
  methods: {
    handlePlaylist(playlist) {
      if (this.$refs.rank) {
        const bottom = playlist.length > 0 ? "60px" : "";

        this.$refs.rank.style.paddingBottom = bottom;
        this.$refs.toplist.refresh();
      }
    },
    selectItem(item) {
      this.$router.push({
        path: `/rank/${item.id}`
      });
      this.setTopList(item);
    },
    _getTopList() {
      getTopList().then(res => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList;
        }
      });
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
// .rank {
//   position: fixed;
//   width: 100%;
//   top: rem(88);
//   bottom: 0;
// }
.toplist {
  // height: 100%;
  width: 100vw;
  height: 86vh;
  overflow: hidden;
}
.item {
  display: flex;
  margin: 0 rem(20);
  padding: rem(10) 0;
  height: rem(100);
}
.item:last-child {
  padding-bottom: rem(20);
}
.icon {
  flex: 0 0 rem(100);
  width: rem(100);
  height: rem(100);
}
.icon img {
  width: rem(100);
  height: rem(100);
}
.songlist {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 rem(20);
  height: rem(100);
  overflow: hidden;
  background: #333;
  color: rgba(255, 255, 255, 0.486);
  font-size: rem(13);
}
.song {
  max-height: rem(26);
  line-height: rem(26);
  overflow: hidden;
}
.song span {
  width: 100%;
  overflow: hidden;
}
.loading-container {
  position: fixed;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter,
.fade-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
