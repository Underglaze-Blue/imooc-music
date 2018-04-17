<template>
  <scroll class="suggest" :pullup="pullup" :data="result" :beforeScroll="beforeScroll" @scrollToEnd="searchMore" @beforeScroll="listScroll" ref="suggest">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import { search } from 'api/search';
import { ERR_OK } from 'api/config';
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song';
import { mapMutations, mapActions } from 'vuex';

import Singer from 'common/js/singer';

import scroll from 'base/scroll/scroll';
import loading from 'base/loading/loading';
import noResult from 'base/noResult/noResult';

const TYPE_SINGER = 'singer';
const PERPAGE = 20;

export default {
  data () {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasMore: true,
      beforeScroll: true
    };
  },
  components: {
    scroll,
    loading,
    noResult
  },
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    listScroll () {
      this.$emit('listScroll');
    },
    getIconCls (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine';
      } else {
        return 'icon-music';
      }
    },
    getDisplayName (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name} · ${item.singer}`;
      }
    },
    selectItem (item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        });
        this.$router.push({
          path: `/search/${singer.id}`
        });
        this.setSinger(singer);
      } else {
        this.insertSong(item);
      }
    },
    _search () {
      this.page = 1;
      this.hasMore = true;
      this.$refs.suggest.scrollTo(0, 0);
      search(this.query, this.page, this.showSinger, PERPAGE).then((response) => {
        if (response.code === ERR_OK) {
          this._genResult(response.data).then((result) => {
            this.result = result;
          });
          this._checkMore(response.data);
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    searchMore () {
      if (!this.hasMore) {
        return;
      }
      this.page++;
      search(this.query, this.page, this.showSinger, PERPAGE).then((response) => {
        if (response.code === ERR_OK) {
          this._genResult(response.data).then((result) => {
            this.result = this.result.concat(result);
          });
          this._checkMore(response.data);
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    _checkMore (data) {
      const song = data.song;
      if (!song.list.length || (song.curnum + song.curpage * PERPAGE) >= song.totalnum) {
        this.hasMore = false;
      }
    },
    // _genResult (data) {
    //   let ret = [];
    //   if (data.zhida && data.zhida.singerid) {
    //     ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } });
    //   }
    //   if (data.song) {
    //     ret = ret.concat(data.song.list);
    //   }
    //   return ret;
    // },
    _genResult (data) {
      let ret = [];
      if (data.zhida && data.zhida.singerid && this.page === 1) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } });
      }
      return processSongsUrl(this._normalizeSongs(data.song.list)).then((songs) => {
        ret = ret.concat(songs);
        return ret;
      });
    },
    _normalizeSongs (list) {
      let ret = [];
      list.forEach((musicData) => {
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query () {
      this._search();
    }
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.suggest
  height 100%
  overflow hidden
  .suggest-list
    padding 0 30px
    .suggest-item
      display flex
      align-items center
      padding-bottom 20px
    .icon
      flex 0 0 30px
      width 30px
      [class^='icon-']
        font-size 14px
        color $color-text-d
    .name
      flex 1
      font-size $font-size-medium
      color $color-text-d
      overflow hidden
      .text
        no-wrao()
  .no-result-wrapper
    position absolute
    width 100%
    top 50%
    transform translateY(-50%)
</style>
