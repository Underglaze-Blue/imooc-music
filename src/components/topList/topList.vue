<template>
  <transition name="slide">"
    <music-list :rank="rank" :title="title" :bgImage="btImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import musicList from 'components/musicList/musicList';

import { mapGetters } from 'vuex';
import { getMusicList } from 'api/rank';
import { ERR_OK } from 'api/config';
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song';

export default {
  name: 'top-list',
  data () {
    return {
      songs: [],
      rank: true
    };
  },
  components: {
    musicList
  },
  computed: {
    title () {
      return this.topList.topTitle;
    },
    btImage () {
      if (this.songs.length) {
        return this.songs[0].image;
      }
      return '';
    },
    ...mapGetters([
      'topList'
    ])
  },
  created () {
    this._getMusicList();
  },
  methods: {
    _getMusicList () {
      if (!this.topList.id) {
        this.$router.push('/rank');
        return;
      }
      getMusicList(this.topList.id).then((response) => {
        if (response.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(response.songlist)).then((songs) => {
            this.songs = songs;
          });
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    _normalizeSongs (list) {
      let ret = [];
      list.forEach((item) => {
        const musicData = item.data;
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
