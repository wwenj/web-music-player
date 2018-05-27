<template>
  <div class="app">
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          1
        </div>
        <div class="swiper-slide">
          2
        </div>
      </div>
      <!-- 如果需要分页器 -->
      <div class="swiper-pagination"></div>
      <!-- 如果需要导航按钮 -->
    </div>
  </div>
</template>

<script>
import Swiper from "assets/js/swiper4";
import { getRecommend } from "api/recommend.js";
import { ERR_OK } from "api/config";
export default {
  name: "Recommend",
  data() {
    return {};
  },
  created() {
    this._getRecommend();
  },
  mounted() {
    new Swiper(".swiper-container", {
      direction: "horizontal",
      loop: true,
      // 如果需要分页器
      pagination: {
        el: ".swiper-pagination"
      }
    });
  },
  methods: {
    _getRecommend: function() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          console.log(res.data.slider);
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "assets/css/mixin.scss";
@import "assets/css/swiper.scss";
</style>
