<template>
  <div class="loading">
    <img width="30" height="30" src="./loading.1.gif">
    <p class="desc">{{title}}</p>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    title: {
      type: String,
      default: "玩命加载中. . ."
    }
  }
};
</script>
<style scoped lang="scss" rel="stylesheet/stylus">
  @import "assets/css/mixin.scss";

.loading{
    width: 100%;
    text-align: center;
  }
.desc{
  line-height: 20px;
  font-size: rem(15);
  color: #f7cd4e;
  margin-top: rem(5);
}

</style>
