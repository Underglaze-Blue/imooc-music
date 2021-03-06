<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close">
          <i class="icon-close" @click="hide"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <searchBox ref="searchBox" placeholder="搜索歌曲" @query="onQueryChange"></searchBox>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
        <div class="list-wrapper">
          <scroll ref="listScroll" class="list-scroll" v-if="currentIndex === 0" :data="playHistory">
            <div class="list-inner">
              <songList :songs="playHistory" @select="selectSong"></songList>
            </div>
          </scroll>
          <scroll ref="listScroll" class="list-scroll" v-else-if="currentIndex === 1" :data="searchHistory">
            <div class="list-inner">
              <searchList @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></searchList>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query" :showSinger="showSinger" @select="selectSuggest" @listScroll="blurInput"></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">当前歌曲已添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import searchBox from 'base/searchBox/searchBox';
import suggest from 'components/suggest/suggest';
import switches from 'base/switches/switches';
import scroll from 'base/scroll/scroll';
import songList from 'base/songList/songList';
import Song from 'common/js/song';
import searchList from 'base/searchList/searchList';
import topTip from 'base/topTip/topTip';

import { searchMixin } from 'common/js/mixin';
import { mapGetters, mapActions } from 'vuex';

export default {
  mixins: [searchMixin],
  data () {
    return {
      showFlag: false,
      showSinger: false,
      currentIndex: 0,
      switches: [
        {
          name: '最近播放'
        },
        {
          name: '搜索历史'
        }
      ]
    };
  },
  components: {
    searchBox,
    suggest,
    switches,
    scroll,
    songList,
    searchList,
    topTip
  },
  methods: {
    show () {
      this.showFlag = true;
      this.$nextTick(() => {
        this.$refs.listScroll.refresh();
      });
    },
    hide () {
      this.showFlag = false;
    },
    switchItem (index) {
      this.currentIndex = index;
    },
    selectSuggest () {
      this.saveSearch();
      this.showTip();
    },
    selectSong (song, index) {
      if (index !== 0) {
        this.insertSong(new Song(song));
        this.showTip();
      }
    },
    showTip () {
      this.$refs.topTip.show();
    },
    ...mapActions([
      'insertSong'
    ])
  },
  computed: {
    ...mapGetters([
      'playHistory'
    ])
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.add-song
  position fixed
  top 0
  bottom 0
  width 100%
  z-index 200
  background $color-background
  &.slide-enter-active, &.slide-leave-active
    transition all 0.3s
  &.slide-enter, &.slide-leave-to
    transform translate3d(100%, 0, 0)
  .header
    position relative
    height 44px
    text-align center
    .title
      line-height 44px
      font-size $font-size-large
      color $color-text
    .close
      position absolute
      top 0
      right 8px
      .icon-close
        display block
        padding 12px
        font-size 20px
        color $color-theme
  .search-box-wrapper
    margin 20px
  .shortcut
    .list-wrapper
      position absolute
      top 165px
      bottom 0
      width 100%
      .list-scroll
        height 100%
        overflow hidden
        .list-inner
          padding 20px 30px
  .search-result
    position fixed
    top 124px
    bottom 0
    width 100%
  .tip-title
    text-align center
    padding 18px 0
    font-size 0
    .icon-ok
      font-size $font-size-medium
      color $color-theme
      margin-right 4px
    .text
      font-size $font-size-medium
      color $color-text
</style>
