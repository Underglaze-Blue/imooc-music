<template>
  <div class="loading">
    <img src="./loading.gif" width="200" height="100"/>
    <p class="desc">{{title}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {

    };
  },
  props: {
    title: {
      type: String,
      default: '正在載入...'
    }
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/stylus/variable';
.loading
  width 100%
  text-align center
  .desc
    line-height 20px
    font-size $font-size-small
    color $color-text-l
</style>
