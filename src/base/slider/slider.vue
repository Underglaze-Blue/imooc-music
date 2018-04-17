<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in dots" :key="index" :class="{active: currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';

import { addClass } from 'common/js/dom';

export default {
  data () {
    return {
      dots: [],
      currentPageIndex: 0
    };
  },
  components: {

  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    atuoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 2000
    }
  },
  // activated () {
  //   this._play();
  // },
  mounted () {
    // setTimeout(() => {
    //   this._setSliderWidth();
    // }, 20);
    this.$nextTick(() => {
      this._setSliderWidth();
      this._initDots();
      this._initSlier();
      if (this.atuoPlay) {
        this._play();
      }
    });

    window.addEventListener('resize', () => {
      if (!this.slider || !this.slider.enabled) {
        return;
      }
      this._setSliderWidth(true);
      this.slider.refresh();
    });
  },
  methods: {
    refresh () {
      if (this.slider) {
        this._setSliderWidth(true);
        this.slider.refresh();
      }
    },
    _setSliderWidth (isResize) {
      this.children = this.$refs.sliderGroup.children;
      let width = 0;
      let sliderWidth = this.$refs.slider.clientWidth;

      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        addClass(child, 'slider-item');
        child.style.width = `${sliderWidth}px`;
        width += sliderWidth;
      }

      if (this.loop && !isResize) {
        width += 2 * sliderWidth;
      }

      this.$refs.sliderGroup.style.width = `${width}px`;
    },
    _initDots () {
      this.dots = new Array(this.children.length);
    },
    _initSlier () {
      this.slider = new BScroll(this.$refs.slider, {
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        },
        scrollX: true,
        scrollY: false,
        momentum: false,
        click: true
      });

      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX;
        // if (this.loop) {
        //   pageIndex -= 1;
        // }
        this.currentPageIndex = pageIndex;
        if (this.atuoPlay) {
          clearTimeout(this.timer);
          this._play();
        }
      });
    },
    _play () {
      // let pageIndex = this.currentPageIndex + 1;
      this.timer = setTimeout(() => {
        // this.slider.goToPage(pageIndex, 0, 400);
        this.slider.next(400);
      }, this.interval);
    }
  },
  deactivated () {
    this.slider.disable();
    clearTimeout(this.timer);
  },
  beforeDestroy () {
    this.slider.disable();
    clearTimeout(this.timer);
  },
  activated () {
    console.log(this.autoPlay);
    this.slider.enable();
    let pageIndex = this.slider.getCurrentPage().pageX;
    this.slider.goToPage(pageIndex, 0, 0);
    this.currentPageIndex = pageIndex;
    this._play();
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/stylus/variable'
.slider
  min-height 1px
  .slider-group
    position relative
    overflow hidden
    white-space nowrap
    .slider-item
      float left
      box-sizing border-box
      overflow hidden
      text-align center
      a
        display block
        width 100%
        overflow hidden
      img
        display block
        width 100%
  .dots
    position absolute
    right 0
    left 0
    bottom 12px
    text-align center
    font-size 0
    .dot
      display inline-block
      margin 0 4px
      width 8px
      height 8px
      border-radius 50%
      background $color-text-l
      &.active
        width 20px
        border-radius 5px
        background $color-text-ll
</style>
