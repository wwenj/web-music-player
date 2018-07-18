<template>
  <div class="app">
    <Scroll v-if="singers.length" :data="singers" class="scroll" :listenScroll="listenScroll" ref="scrollView">
      <ul ref="singerUl">
        <li class="li-box" v-for="(item1, index) in singers" :key="index" ref="listView">
          <h2 class="title">{{item1.title}}</h2>
          <ul>
            <li @click="toSingerDetail(item2)" class="li-con" v-for="(item2, index) in item1.list" :key="index">
              <img v-lazy="item2.img" alt="">
              <span class="name">{{item2.name}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <!-- <h2 id="fixed" class="title">A</h2> -->
    </Scroll>
    <div class="tab-right">
      <ul>
        <li v-for="(item, index) in singers" :key="index" @touchstart.stop.prevent="toTouchScroll(index)">{{ item.title }}</li>
      </ul>
    </div>
    <!-- 歌手详情子路由 -->
    <transition name="fade">
      <router-view></router-view>
    </transition>
    <!-- loading -->
    <div class="loading" v-show="singers.length === 0?1:0">
      <loading></loading>
    </div>
  </div>
</template>

<script>
import loading from "base/loading/loading";
import Scroll from "base/scroll/scroll";
import { getSingerList } from "api/singer";
import { ERR_OK } from "api/config";
import { mapMutations, mapGetters } from "vuex";
import { playlistMixin } from "assets/js/mixin";
export default {
  name: "Singer",
  mixins: [playlistMixin],
  components: {
    Scroll,
    loading
  },
  data() {
    return {
      singers: [],
      pulldown: true
    };
  },
  computed: {
    ...mapGetters(["playlist"])
  },
  created() {
    this._getSingerList();
    this.listenScroll = true;
  },
  methods: {
    handlePlaylist(playlist) {
      if (this.$refs.singerUl) {
        const bottom = playlist.length > 0 ? "60px" : "";

        this.$refs.singerUl.style.paddingBottom = bottom;
        this.$refs.scrollView.refresh();
      }
    },
    _getSingerList: function() {
      var that = this;
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          that.singers = res.data.list;
          //  (that.singers);
          that._newData(res.data.list);
        }
      });
    },
    /* 改变封装原有数据 */
    _newData: function(dataList) {
      var newList = {};
      dataList.forEach(function(item, index) {
        // 遍历原有数据数组
        var isOn = 0; // 新建拼接后数据对象
        for (let key in newList) {
          // 遍历isOn对象是否已存在原数组遍历时的字母
          if (key === item.Findex) {
            isOn = 1;
          }
        }
        if (isOn === 1) {
          newList[item.Findex].list.push({
            // 如果已存在则直接向这组数据中push这个元素
            id: item.Fsinger_id,
            mid: item.Fsinger_mid,
            name: item.Fsinger_name,
            img: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${
              item.Fsinger_mid
            }.jpg?max_age=2592000`
          });
          isOn = 0;
        } else if (isOn === 0) {
          // 如果没有则新建这组数据并把元素push进去
          if (item.Findex === "9") {
            item.Findex = "其他";
          }
          newList[item.Findex] = {
            title: item.Findex,
            list: [
              {
                id: item.Fsinger_id,
                mid: item.Fsinger_mid,
                name: item.Fsinger_name,
                img: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${
                  item.Fsinger_mid
                }.jpg?max_age=2592000`
              }
            ]
          };
        }
      });
      var newList2 = [];
      for (let key in newList) {
        // 数据对象转为数组
        newList2.push(newList[key]);
      }
      /* 按数组中对象属性字母排序 */
      function compare(property) {
        return function(a, b) {
          var value1 = a[property].charCodeAt();
          var value2 = b[property].charCodeAt();
          return value1 - value2;
        };
      }
      newList2.sort(compare("title"));
      this.singers = newList2;
    },
    toTouchScroll: function(index) {
      // alert('5')
      this.$refs.scrollView.scrollToElement(this.$refs.listView[index], 0);
    },
    // scroll: function(pos) {
    //   // console.log(pos.y);
    // },
    toSingerDetail: function(item) {
      this.$router.push({
        path: `/singer/${item.id}`
      });
      this.setSinger(item);
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    })
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "assets/css/mixin.scss";
.scroll {
  position: relative;
  width: 100vw;
  height: 87vh;
  overflow: hidden;
}
.app {
  position: relative;
  // display: block;
  // width: 100%;
  // height: 100%;
  // overflow: hidden;
}
.li-box {
  width: 100%;
  padding-bottom: rem(30);
}
.title {
  width: 100%;
  height: rem(30);
  padding-left: rem(20);
  box-sizing: border-box;
  color: hsla(0, 0%, 100%, 0.5);
  background: #333;
  font-size: rem(12);
  line-height: rem(30);
}
.li-con {
  width: 100%;
  height: rem(70);
  padding: rem(20) 0 0 rem(30);
  box-sizing: border-box;
}
img {
  width: rem(50);
  height: rem(50);
  line-height: rem(50);
  border-radius: rem(50);
  vertical-align: middle;
}
.name {
  display: inline-block;
  font-size: rem(14);
  margin-left: rem(20);
  color: hsla(0, 0%, 100%, 0.5);
  vertical-align: middle;
}
/* 侧面导航字母 */
.tab-right {
  position: absolute;
  z-index: 300;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: rem(20);
  padding: rem(20) 0;
  border-radius: rem(10);
  background: rgba(0, 0, 0, 0.3);
  font-family: Helvetica;
}
.tab-right li {
  padding-bottom: rem(6);
  line-height: 1;
  text-align: center;
  color: hsla(0, 0%, 100%, 0.5);
  font-size: rem(12);
}
#fixed {
  position: absolute;
  top: rem(-1);
  left: 0;
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
.loading {
  position: fixed;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
</style>
