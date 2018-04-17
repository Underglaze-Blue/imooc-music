<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :data="topList" ref="topList">
      <ul>
        <li class="item" v-for="(item, index) in topList" :key="index" @click="selectItem(item)">
          <div class="icon">
            <img v-lazy="item.picUrl" />
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, index) in item.songList" :key="index">
              <span>{{index+1}}</span>
              <span>{{song.songname}} · {{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view/>
  </div>
</template>

<script type="text/ecmascript-6">
import { getTopList } from 'api/rank';
import { ERR_OK } from 'api/config';
import { playlistMixin } from 'common/js/mixin';
import {mapMutations} from 'vuex';

import scroll from 'base/scroll/scroll';
import loading from 'base/loading/loading';

export default {
  mixins: [playlistMixin],
  data () {
    return {
      topList: []
    };
  },
  components: {
    scroll,
    loading
  },
  created () {
    this._getTopList();
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : 0;
      this.$refs.rank.style.bottom = bottom;
      this.$refs.topList.refresh();
    },
    selectItem (item) {
      this.$router.push({
        path: `/rank/${item.id}`
      });
      this.setTopList(item);
    },
    _getTopList () {
      getTopList().then((response) => {
        if (response.code === ERR_OK) {
          this.topList = response.data.topList;
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.rank
  position fixed
  width 100%
  top 88px
  bottom 0
  .toplist
    height 100%
    overflow hidden
    .item
      display flex
      margin 0 20px
      height 100px
      padding-top 20px
      &:last-child
        padding-bottom 20px
      .icon
        flex 0 0 100px
        width 100px
        height 100px
        img
          width 100px
          height 100px
      .songlist
        flex 1
        display flex
        flex-direction column
        justify-content center
        padding 0 20px
        height 100px
        overflow hidden
        background $color-highlight-background
        color $color-text-d
        font-size $font-size-small
        .song
          no-wrap()
          line-height 26px
    .loading-container
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>
