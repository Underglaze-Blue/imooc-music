<template>
  <div class="singer" ref="singer">
    <listview :data="singers" @select="selectSinger" ref="list"></listview>
    <router-view/>
  </div>
</template>

<script type="text/ecmascript-6">
import { getSingerList } from 'api/singer';
import { ERR_OK } from 'api/config';
import { mapMutations } from 'vuex';
import { playlistMixin } from 'common/js/mixin';

import Singer from 'common/js/singer';

import listview from 'base/listview/listview';

const HOT_NAME = '热门';
const HOT_SINGER_LENGTH = 10;

export default {
  mixins: [playlistMixin],
  data () {
    return {
      singers: []
    };
  },
  components: {
    listview
  },
  created () {
    this._getSingerList();
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.singer.style.bottom = bottom;
      this.$refs.list.refresh();
    },
    selectSinger (singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      });
      this.setSinger(singer);
    },
    _getSingerList () {
      getSingerList().then((response) => {
        if (response.code === ERR_OK) {
          this.singers = this._normalizeSingers(response.data.list);
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    _normalizeSingers (list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LENGTH) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }));
        }

        let key = item.Findex;
        if (/\d/.test(key)) {
          key = key.replace(/\d/, '#');
        }
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }));
      });
      // 转换为有序列表
      let hot = [];
      let ret = [];
      let other = [];
      for (let key in map) {
        let val = map[key];
        if (val.title.match(/[A-Za-z]/)) {
          ret.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        } else if (val.title.match(/[#]/)) {
          other.push(val);
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret, other);
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.singer
  position fixed
  top 88px
  bottom 0
  width 100%
</style>
