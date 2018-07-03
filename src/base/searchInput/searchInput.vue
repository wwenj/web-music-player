<template>
  <div class="search-input">
    <img class="togo" src="./togo.png" alt="搜索" title="搜索">
    <input ref="query" v-model="query" class="input-box" :placeholder="placeholder" />
    <img v-show="query" class="toclear" src="./toclear.png" alt="清除" title="清空" @click="clear">
  </div>
</template>

<script type="text/ecmascript-6">
import { debounce } from "assets/js/util";

export default {
  props: {
    placeholder: {
      type: String,
      default: "搜索歌曲、歌手"
    }
  },
  data() {
    return {
      query: ""
    };
  },
  methods: {
    clear() {
      this.query = "";
    },
    setQuery(query) {
      this.query = query;
    },
    blur() {
      this.$refs.query.blur();
    }
  },
  created() {
    this.$watch(
      "query",
      debounce(newQuery => {
        this.$emit("query", newQuery);
      }, 200)
    );
  }
};
</script>
<style scoped lang="scss">
@import "assets/css/mixin.scss";
.search-input {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 rem(6);
  height: rem(40);
  background: #333;
  border-radius: rem(6);
}
.search-input img {
  width: rem(18);
  height: rem(18);
}
.icon-search {
  font-size: 24px;
  color: #222;
}

.input-box {
  flex: 1;
  margin: 0 rem(5);
  line-height: rem(18);
  background: #333;
  color: #fff;
  font-size: rem(14);
  outline: none;
  border: none;
  text-indent: rem(5);
}

.box::placeholder {
  color: #fff;
}
.icon-dismiss {
  font-size: 16px;
  color: #222;
}
</style>
