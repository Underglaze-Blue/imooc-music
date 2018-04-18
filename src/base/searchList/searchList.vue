<template>
  <div class="search-list" v-show="searches.length">
      <transition-group name="list" tag="ul">
        <li @click="selectItem(item)" class="search-item" v-for="(item, index) in searches" :key="index">
          <span class="text">{{item}}</span>
          <span class="icon" @click.stop="deleteOnde(item)">
            <i class="icon-delete"></i>
          </span>
        </li>
      </transition-group>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {

    };
  },
  props: {
    searches: {
      type: Array,
      default: null
    }
  },
  methods: {
    selectItem (item) {
      this.$emit('select', item);
    },
    deleteOnde (item) {
      this.$emit('delete', item);
    }
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.search-list
  .search-item
    display flex
    align-items center
    height 40px
    overflow hidden
    &.list-enter-active, &.list-leave-active
      transition all 0.1s
    &.list-enter, &.list-leave-to
      height 0
    .text
      flex 1
      color $color-text-l
    .icon
      extend-click()
      .icon-delete
        font-size $font-size-small
        color $color-text-d
</style>
