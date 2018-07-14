<template>
  <transition name="drop">
    <div class="top-tip" v-show="showFlag" @click.stop="hide">
      <slot></slot>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapMutations } from "vuex";
export default {
  props: {
    delay: {
      type: Number,
      default: 1300
    }
  },
  data() {
    return {
      showFlag: false
    };
  },
  methods: {
    show() {
      this.setFullScreen(false); // 收起播放页
      this.showFlag = true;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.hide();
      }, this.delay);
    },
    hide() {
      this.showFlag = false;
    },
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN"
    })
  }
};
</script>

<style scoped lang="scss">
@import "assets/css/mixin.scss";

.top-tip {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 900;
  background: rgb(91, 169, 241);
}

.drop-enter-active,
.drop-leave-active {
  transition: all 0.3s;
}

.drop-enter,
.drop-leave-to {
  transform: translate3d(0, -100%, 0);
}
</style>
