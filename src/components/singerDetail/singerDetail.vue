<template>
  <transition name="slide">
    <music-list :songs="songs" :bg-image="bgImage" :title="title"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex';
import { getSingerDetail } from 'api/singer';
import { ERR_OK } from 'api/config';
import { createSong, processSongsUrl } from 'common/js/song';

import musicList from 'components/musicList/musicList';

export default {
  data () {
    return {
      songs: []
    };
  },
  components: {
    musicList
  },
  computed: {
    title () {
      return this.singer.name;
    },
    bgImage () {
      return this.singer.avatar;
    },
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    this._getDetail();
  },
  methods: {
    _getDetail () {
      if (!this.singer.id) {
        this.$router.push('/singer');
        return;
      }
      getSingerDetail(this.singer.id).then((response) => {
        if (response.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(response.data.list)).then((songs) => {
            this.songs = songs;
          });
          // this.songs = this._normalizeSongs(response.data.list);
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    _normalizeSongs (list) {
      let ret = [];
      list.forEach((item) => {
        let { musicData } = item;
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/stylus/variable'
.slide-enter-active, .slide-leave-active
  transition all 0.3s
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
</style>
