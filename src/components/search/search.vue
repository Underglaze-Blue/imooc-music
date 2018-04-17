<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li @click="addQuery(item.k)" class="item" v-for="(item, index) in hotkey" :key="index">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest @listScroll="blurInput" :query="query"></suggest>
    </div>
    <router-view/>
  </div>
</template>

<script type="text/ecmascript-6">
import searchBox from 'base/searchBox/searchBox';
import suggest from 'components/suggest/suggest';

import { getHotKey } from 'api/search';
import { ERR_OK } from 'api/config';

export default {
  data () {
    return {
      hotkey: [],
      query: ''
    };
  },
  components: {
    searchBox,
    suggest
  },
  created () {
    this._getHotKey();
  },
  methods: {
    blurInput () {
      this.$refs.searchBox.blur();
    },
    addQuery (query) {
      this.$refs.searchBox.setQuery(query);
    },
    onQueryChange (query) {
      this.query = query;
    },
    _getHotKey () {
      getHotKey().then((response) => {
        if (response.code === ERR_OK) {
          this.hotkey = response.data.hotkey.slice(0, 10);
        }
      }).catch((error) => {
        console.log(error);
      });
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
