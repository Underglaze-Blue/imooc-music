<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
      <scroll class="shortcut" ref="shortcut" :data="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="(item, index) in hotkey" :key="index">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list @select="addQuery" @delete="deleteSearchHistory" :searches="searchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div ref="searchResult" class="search-result" v-show="query">
      <suggest @select="saveSearch" @listScroll="blurInput" :query="query" ref="suggest"></suggest>
    </div>
    <confirm ref="confirm" text="是否清空所有搜索历史" confirmBtnText="清空" @confirm="clearSearchHistory"></confirm>
    <router-view/>
  </div>
</template>

<script type="text/ecmascript-6">
import searchBox from 'base/searchBox/searchBox';
import suggest from 'components/suggest/suggest';
import searchList from 'base/searchList/searchList';
import confirm from 'base/confirm/confirm';
import scroll from 'base/scroll/scroll';

import { getHotKey } from 'api/search';
import { ERR_OK } from 'api/config';
import { mapActions } from 'vuex';
import { playlistMixin, searchMixin } from 'common/js/mixin';

export default {
  mixins: [playlistMixin, searchMixin],
  data () {
    return {
      hotkey: []
    };
  },
  components: {
    searchBox,
    suggest,
    searchList,
    confirm,
    scroll
  },
  created () {
    this._getHotKey();
  },
  computed: {
    shortcut () {
      return this.hotkey.concat(this.searchHistory);
    }
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : 0;
      this.$refs.shortcutWrapper.style.bottom = bottom;
      this.$refs.searchResult.style.bottom = bottom;
      this.$refs.shortcut.refresh();
      this.$refs.suggest.refresh();
    },
    showConfirm () {
      this.$refs.confirm.show();
    },
    _getHotKey () {
      getHotKey().then((response) => {
        if (response.code === ERR_OK) {
          this.hotkey = response.data.hotkey.slice(0, 10);
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    ...mapActions([
      'clearSearchHistory'
    ])
  },
  watch: {
    query (newQuery) {
      if (!newQuery) {
        this.$nextTick(() => {
          this.$refs.shortcut.refresh();
        });
      }
    }
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.search
  .search-box-wrapper
    margin 20px
  .shortcut-wrapper
    position fixed
    top 178px
    bottom 0
    width 100%
    .shortcut
      height 100%
      overflow hidden
      .hot-key
        margin 0 20px 20px
        .title
          margin-bottom 20px
          font-size $font-size-medium
          color $color-text-l
        .item
          display inline-block
          padding 5px 10px
          margin 0 10px 20px 0
          border-radius 6px
          background $color-highlight-background
          font-size $font-size-medium
          color $color-text-d
      .search-history
        position relative
        margin 0 20px
        .title
          display flex
          align-items center
          height 40px
          font-size $font-size-medium
          color $color-text-l
          .text
            flex 1
          .clear
            extend-click()
            .icon-clear
              font-size $font-size-meium
              color $color-text-d
  .search-result
    position fixed
    width 100%
    top 178px
    bottom 0
</style>
