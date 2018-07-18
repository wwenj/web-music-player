<template>
  <Scroll v-if="banner.length" :data="discList" class="app" ref="scroll">
    <div>
      <!-- 轮播 -->
      <div class="swiper-container">
        <swiper v-if="banner.length" class="swiper-wrapper" :options="swiperOption" ref="mySwiper">
          <swiperSlide class="swiper-slide" v-for="(item,index) in banner" :key="index">
            <a :href="item.linkUrl">
              <img @load="imgOnload" :src="item.picUrl" alt="">
            </a>
          </swiperSlide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
      <!-- 推荐歌单 -->
      <div class="gedanTitle" v-show="discList">热门歌单推荐</div>
      <ul v-if="discList.length" class="discList-ul" ref="discListUl">
        <li @click="selectItem(item)" class="discList-li" v-for="(item,index) in discList" :key="index">
          <img v-lazy="item.imgurl" alt="歌单" :title="item.creator.name">
          <div class="discList-con">
            <h2>{{item.creator.name}}</h2>
            <p>{{item.dissname}}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="loading" v-show="discList.length === 0?1:0">
      <loading></loading>
    </div>
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </Scroll>
</template>

<script>
import Scroll from "base/scroll/scroll";
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { getRecommend, getDiscList } from "api/recommend.js";
import { ERR_OK } from "api/config";
import loading from "base/loading/loading";
import { mapMutations, mapGetters } from "vuex";
import { playlistMixin } from "assets/js/mixin";
export default {
  name: "Recommend",
  mixins: [playlistMixin],
  components: {
    swiper,
    swiperSlide,
    loading,
    Scroll
  },
  data() {
    return {
      banner: [],
      discList: [],
      swiperOption: {
        pagination: {
          el: ".swiper-pagination",
          type: "progressbar"
        },
        autoplay: true
      }
    };
  },
  created() {
    this._getRecommend();
    this._getDiscList();
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
    ...mapGetters(["playlist"])
  },
  mounted() {
    // this.swiper.slideTo(3, 1000, false);
  },
  methods: {
    handlePlaylist(playlist) {
      if (this.$refs.discListUl) {
        const bottom = playlist.length > 0 ? "60px" : "";

        this.$refs.discListUl.style.paddingBottom = bottom;
        this.$refs.scroll.refresh();
      }
    },
    _getRecommend: function() {
      var that = this;
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          that.banner = res.data.slider;
        }
      });
    },
    _getDiscList() {
      var that = this;
      getDiscList().then(res => {
        if (res.code === ERR_OK) {
          that.discList = res.data.list;
        }
      });
    },
    imgOnload() {
      if (!this.checkloaded) {
        this.checkloaded = true;
        this.$refs.scroll.refresh();
      }
    },
    // 推荐个点详情
    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      });
      this.setDisc(item);
    },
    ...mapMutations({
      setDisc: "SET_DISC"
    })
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "assets/css/mixin.scss";
.app {
  width: 100vw;
  height: 86vh;
  overflow: hidden;
}
.swiper-container {
  width: 100%;
  height: rem(150);
  background: #fff;
}
.swiper-container img {
  width: 100%;
  height: rem(150);
}
.gedanTitle {
  width: 100%;
  height: rem(65);
  text-align: center;
  line-height: rem(65);
  color: #ffcd32;
  font-size: rem(15);
  letter-spacing: rem(2);
}
.discList-ul {
  width: 100%;
  // padding-bottom: rem(30);
}
.discList-li {
  width: 100%;
  min-height: rem(80);
  box-sizing: border-box;
  padding: 0 rem(20) rem(20) rem(20);
  position: relative;
}
.discList-li img {
  width: rem(60);
  height: rem(60);
  position: absolute;
}
.discList-con {
  padding-left: rem(80);
}
.discList-con h2 {
  margin-bottom: rem(10);
  color: #fff;
  font-size: rem(15);
  padding-top: rem(6);
}
.discList-con p {
  color: hsla(0, 0%, 100%, 0.3);
  font-size: rem(14);
}
.loading {
  position: fixed;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
  // z-index: 200;
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
</style>
