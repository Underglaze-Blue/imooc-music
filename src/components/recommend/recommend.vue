<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" :data="discList" class="recommend-content">
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="(item, key) in recommends" :key="key">
              <a :href="item.linkUrl">
                <img @load="loadImage" :src="item.picUrl" />
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click="selectItem(item)" v-for="(item, index) in discList" :key="index" class="item">
              <div class="icon">
                <img v-lazy="item.imgurl" />
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view/>
  </div>
</template>

<script type="text/ecmascript-6">
import Slider from 'base/slider/slider';
import scroll from 'base/scroll/scroll';
import loading from 'base/loading/loading';

import { getRecommend, getDiscList } from 'api/recommend';
import { ERR_OK } from 'api/config';
import { playlistMixin } from 'common/js/mixin';
import { mapMutations } from 'vuex';

export default {
  mixins: [playlistMixin],
  data () {
    return {
      recommends: [],
      discList: []
    };
  },
  components: {
    Slider,
    scroll,
    loading
  },
  created () {
    this._getRecommend();
    this._getDiscList();
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.recommend.style.bottom = bottom;
      this.$refs.scroll.refresh();
    },
    selectItem (item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      });
      this.setDisc(item);
    },
    _getRecommend () {
      getRecommend().then((response) => {
        if (response.code === ERR_OK) {
          this.recommends = response.data.slider;
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    _getDiscList () {
      getDiscList().then((response) => {
        if (response.code === ERR_OK) {
          this.discList = response.data.list;
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    loadImage () {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh();
        this.checkLoaded = true;
      }
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.recommend
  position fixed
  width 100%
  top 88px
  bottom 0
  .recommend-content
    height 100%
    overflow hidden
    .slider-wrapper
      position relative
      width 100%
      overflow hidden
    .recommend-list
      .list-title
        height 65px
        line-height 65px
        text-align center
        font-size $font-size-medium
        color $color-theme
      .item
        display flex
        box-sizing border-box
        align-items center
        padding 0 20px 20px
        .icon
          flex 0 0 60px
          width 60px
          padding-right 20px
          img
            width 60px
            height 60px
        .text
          flex 1
          display flex
          justify-content center
          flex-direction column
          line-height 20px
          overflow hidden
          font-size $font-size-medium
          .name
            margin-bottom 10px
            color $color-text
          .desc
            color $color-text-d
    .loading-container
      position absolute
      top 50%
      width 100%
      transform translateY(-50%)
</style>
