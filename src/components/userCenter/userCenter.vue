<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
      </div>
      <div class="play-btn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="listScroll" class="list-scroll" v-if="currentIndex === 0" :data="favoriteList">
          <div class="list-inner">
            <songList :songs="favoriteList" @select="selectSong"></songList>
          </div>
        </scroll>
        <scroll ref="listScroll" class="list-scroll" v-else-if="currentIndex === 1" :data="playHistory">
          <div class="list-inner">
            <songList :songs="playHistory" @select="selectSong"></songList>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import switches from 'base/switches/switches';
import scroll from 'base/scroll/scroll';
import songList from 'base/songList/songList';
import noResult from 'base/noResult/noResult';

import { mapGetters, mapActions } from 'vuex';
import { playlistMixin } from 'common/js/mixin';
import Song from 'common/js/song';

export default {
  mixins: [playlistMixin],
  data () {
    return {
      currentIndex: 0,
      switches: [
        {
          name: '我喜欢的'
        },
        {
          name: '最近听的'
        }
      ]
    };
  },
  components: {
    switches,
    scroll,
    songList,
    noResult
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.listWrapper.style.bottom = bottom;
      this.$refs.listScroll.refresh();
    },
    back () {
      this.$router.back();
    },
    random () {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory;
      if (!list.length) {
        return;
      }
      list = list.map((song) => {
        return new Song(song);
      });
      this.randomPlay({ list });
    },
    switchItem (index) {
      this.currentIndex = index;
    },
    selectSong (song) {
      this.insertSong(new Song(song));
    },
    ...mapActions([
      'insertSong',
      'randomPlay'
    ])
  },
  computed: {
    noResult () {
      return this.currentIndex === 0 ? !this.favoriteList.length : !this.playHistory.length;
    },
    noResultDesc () {
      return this.currentIndex === 0 ? '暂无收藏歌曲' : '暂无播放历史';
    },
    ...mapGetters([
      'favoriteList',
      'playHistory'
    ])
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/stylus/variable'
.user-center
  position fixed
  top 0
  bottom 0
  z-index 100
  width 100%
  background $color-background
  &.slide-enter-active, &.slide-leave-active
    transition all 0.3s
  &.slide-enter, &.slide-leave-to
    transform translate3d(100%, 0, 0)
  .back
    position absolute
    top 0
    left 6px
    z-index 50
    .icon-back
      display block
      padding 10px
      font-size $font-size-large-x
      color $color-theme
  .switches-wrapper
    margin 10px 0 30px
  .play-btn
    box-sizing border-box
    width 135px
    padding 7px 0
    margin 0 auto
    text-align center
    border 1px solid $color-text-l
    color $color-text-l
    border-radius 100px
    font-size 0
    .icon-play
      display inline-block
      vertical-align middle
      margin-right 6px
      font-size $font-size-medium-x
    .text
      display inline-block
      vertical-align middle
      font-size $font-size-small
  .list-wrapper
    position absolute
    top 110px
    bottom 0
    width 100%
    .list-scroll
      height 100%
      overflow hidden
      .list-inner
        padding 20px 30px
  .no-result-wrapper
    position absolute
    width 100%
    top 50%
    transform translateY(-50%)
</style>
