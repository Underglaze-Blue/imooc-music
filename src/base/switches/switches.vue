<template>
  <ul class="switches">
    <li class="switch-item" v-for="(item, index) in switches" :key="index" :class="{active: currentIndex === index}" @click="switchItem(index)">
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {

    };
  },
  props: {
    switches: {
      type: Array,
      defalut: []
    },
    currentIndex: {
      type: Number,
      defalut: 0
    }
  },
  methods: {
    switchItem (index) {
      this.$emit('switch', index);
    }
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/stylus/variable'
.switches
  display flex
  align-items center
  width 240px
  margin 0 auto
  border 1px solid $color-highlight-background
  border-radius 7px
  overflow hidden
  .switch-item
    flex 1
    padding 8px
    text-align center
    font-size $font-size-medium
    color $color-text-d
    &.active
      background $color-highlight-background
      color $color-text
</style>
