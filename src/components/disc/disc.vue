<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import musicList from 'components/musicList/musicList';

import { mapGetters } from 'vuex';
import { getSongList } from 'api/recommend';
import { ERR_OK } from 'api/config';
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song';

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
      return this.disc.dissname;
    },
    bgImage () {
      return this.disc.imgurl;
    },
    ...mapGetters([
      'disc'
    ])
  },
  created () {
    this._getSongList();
  },
  methods: {
    _getSongList () {
      if (!this.disc.dissid) {
        this.$router.push('/recommend');
      }
      getSongList(this.disc.dissid).then((response) => {
        if (response.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(response.cdlist[0].songlist)).then((songs) => {
            this.songs = songs;
          });
        }
      }).catch((error) => {
        console.log(error);
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
    }
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
.slide-enter-active, .slide-lieave-active
  transition all 0.3s
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
</style>
