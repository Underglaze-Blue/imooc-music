<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag">
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{text}}</p>
          <div class="operate">
            <div class="operate-btn left" @click="cancel">{{cancelBtnText}}</div>
            <div class="operate-btn" @click="confirm">{{confirmBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      showFlag: false
    };
  },
  methods: {
    show () {
      this.showFlag = true;
    },
    hide () {
      this.showFlag = false;
    },
    cancel () {
      this.hide();
      this.$emit('cancel');
    },
    confirm () {
      this.hide();
      this.$emit('confirm');
    }
  },
  props: {
    text: {
      type: String,
      default: ''
    },
    confirmBtnText: {
      type: String,
      default: '确定'
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    }
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/stylus/variable'
.confirm
  position fixed
  left 0
  right 0
  top 0
  bottom 0
  z-index 499
  background-color $color-background-d
  &.confirm-fade-enter-active
    animation confirm-fadeIn .3s
    .confirm-content
      animation confirm-zoom .3s
  .confirm-wrapper
    position absolute
    top 50%
    left 50%
    transform translate3d(-50%,-50%,0)
    z-index 500
    .confirm-content
      width 270px
      border-radius 13px
      background $color-highlight-background
      .text
        padding 19px 15px
        line-height 22px
        text-align center
        font-size $font-size-large
        color $color-text-l
      .operate
        display flex
        align-items center
        text-align center
        font-size $font-size-large
        .operate-btn
          flex 1
          line-height 22px
          padding 10px 0
          border-top 1px solid $color-background-d
          color $color-theme
          &.left
            color $color-text-d
            border-right 1px solid $color-background-d

@keyframes confirm-fadeIn
  0%
    opacity 0
  100%
    opacity 1

@keyframes confirm-zoom
  0%
    transform scale(0)
  50%
    transform scale(1.2)
  100%
    transform scale(1)

</style>
