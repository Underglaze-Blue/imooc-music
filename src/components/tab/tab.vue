<template>
  <div class="tab">
    <router-link to="/recommend" class="tab-item" tag="div">
      <span class="text">推荐</span>
    </router-link>
    <router-link to="/singer" class="tab-item" tag="div">
      <span class="text">歌手</span>
    </router-link>
    <router-link to="/rank" class="tab-item" tag="div">
      <span class="text">排行</span>
    </router-link>
    <router-link to="/search" class="tab-item" tag="div">
      <span class="text">搜索</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {

    };
  },
  components: {

  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.tab
  display flex
  height 44px
  width 100%
  line-height 44px
  font-size $font-size-medium
  .tab-item
    flex 1
    text-align center
    .text
      padding-bottom 5px
      color $color-text-l
    &.router-link-active
      .text
        color $color-theme
        border-bottom 2px solid $color-theme
</style>
