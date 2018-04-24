<template>
  <div class="player" v-show="playlist.length > 0">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <!-- <div class="normal-player" :style="{visibility : fullScreen ? 'visible' : 'hidden'}"> -->
      <div class="normal-player" v-show="fullScreen">
        <div class="background" ref="background">
          <!-- <img :src="currentSong.image"> -->
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend.prevent="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div ref="cdImage" class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric" ref="playingLyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" class="text" v-for="(line, index) in currentLyric.lines" :key="index" :class="{current: currentLineNum === index}">{{line.txt}}</p>
              </div>
              <div class="pure-music" v-show="isPureMusic">
                <p>{{pureMusicLyric}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{active: currentShow === 'cd'}"></span>
            <span class="dot" :class="{active: currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar ref="progressBar" :percent="percent" @touchEndParcentChange="touchEndParcentChange" @touchMoveParcentChange="touchMoveParcentChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disable">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disable">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disable">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon" :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <!-- <div class="mini-player" :style="{visibility : !fullScreen ? 'visible' : 'hidden'}" @click="open"> -->
      <div class="mini-player" @click="open" v-show="!fullScreen">
        <div class="icon">
          <img ref="miniImage" :class="cdCls" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p v-if="!playingLyric" class="desc" v-html="currentSong.singer"></p>
          <p class="desc" v-else-if="playingLyric">{{playingLyric}}</p>
        </div>
        <div class="control">
          <progressCircle :radius="radius" :percent="percent">
            <i :class="miniIcon" class="icon-mini" @click.stop="togglePlaying"></i>
          </progressCircle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
    <audio ref="audio" @playing="ready" @error="error" @timeupdate="timeupdate" @ended="end" @paused="paused"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import animations from 'create-keyframe-animation';
import Lyric from 'lyric-parser';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { prefixStyle } from 'common/js/dom';
import { playMode } from 'common/js/config';
import { playerMixin } from 'common/js/mixin';

import progressBar from 'base/progressBar/progressBar';
import progressCircle from 'base/progressCircle/progressCircle';
import scroll from 'base/scroll/scroll';
import playlist from 'components/playlist/playlist';

const TRANSFORM = prefixStyle('transform');
const TRANSITION_DURATION = prefixStyle('transitionDuration');

const timeExp = /\[(\d{2}):(\d{2}):(\d{2})]/g;

export default {
  mixins: [playerMixin],
  data () {
    return {
      songReady: false,
      currentTime: 0,
      move: false,
      radius: 32,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      playingLyric: '',
      isPureMusic: false,
      pureMusicLyric: ''
    };
  },
  components: {
    progressBar,
    progressCircle,
    scroll,
    playlist
  },
  created () {
    this.rotateCd = 0;
    this.rotateMini = 0;
    this.touch = {};
  },
  computed: {
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play';
    },
    miniIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
    },
    cdCls () {
      return this.playing ? 'play' : 'play pause';
    },
    disable () {
      return this.songReady ? '' : 'disable';
    },
    percent () {
      return this.currentTime / this.currentSong.duration;
    },
    ...mapGetters([
      'fullScreen',
      'playing',
      'currentIndex'
    ])
  },
  methods: {
    back () {
      this.setFullScreen(false);
      this.rotateCd = this._getRotate(this.$refs.cdImage);
      this.$refs.miniImage.style['animation-delay'] = '';
      let time = this.rotateCd / 360 * 20;
      this.$refs.miniImage.style['animation-delay'] = `-${time}s`;
    },
    open () {
      this.setFullScreen(true);
      this.rotateMini = this._getRotate(this.$refs.miniImage);
      this.$refs.cdImage.style['animation-delay'] = '';
      let time = this.rotateMini / 360 * 20;
      this.$refs.cdImage.style['animation-delay'] = `-${time}s`;
    },
    togglePlaying () {
      if (!this.songReady) {
        return;
      }
      this.setPlayingState(!this.playing);
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    next () {
      if (!this.songReady) {
        return;
      }
      this._resetAnimation();
      if (this.playlist.length === 1) {
        this.loop();
      } else {
        let index = this.currentIndex + 1;
        if (index === this.playlist.length) {
          index = 0;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
      }
    },
    prev () {
      if (!this.songReady) {
        return;
      }
      this._resetAnimation();
      if (this.playlist.length === 1) {
        this.loop();
      } else {
        let index = this.currentIndex - 1;
        if (index === -1) {
          index = this.playlist.length - 1;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
      }
    },
    end () {
      this.currentTime = 0;
      if (this.mode === playMode.loop) {
        this.loop();
        return;
      }
      this.next();
    },
    loop () {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      this._resetAnimation();
      if (this.currentLyric) {
        this.currentLyric.seek();
      }
    },
    ready () {
      clearTimeout(this.timer);
      // 监听 playing 这个事件可以确保慢网速或者快速切换歌曲导致的 DOM Exception
      this.songReady = true;
      this.canLyricPlay = true;
      // this.savePlayHistory(this.currentSong);
      // 如果歌曲的播放晚于歌词的出现，播放的时候需要同步歌词
      if (this.currentLyric && !this.isPureMusic) {
        this.currentLyric.seek(this.currentTime * 1000);
      }
      this.savePlayHistory(this.currentSong);
    },
    paused () {
      this.setPlayingState(false);
      if (this.currentLyric) {
        this.currentLyric.stop();
      }
    },
    error () {
      clearTimeout(this.timer);
      this.songReady = true;
    },
    timeupdate (e) {
      if (this.move) {
        return;
      }
      this.currentTime = e.target.currentTime;
    },
    format (interval) {
      interval = interval | 0;
      const minute = this._pad(interval / 60 | 0);
      const second = this._pad(interval % 60);
      return `${minute}:${second}`;
    },
    touchMoveParcentChange (parcent) {
      this.move = true;
      this.currentTime = this.currentSong.duration * parcent;
      if (this.currentLyric) {
        this.currentLyric.seek(this.currentTime * 1000);
      }
    },
    touchEndParcentChange (parcent) {
      this.move = false;
      const currentTime = this.currentSong.duration * parcent;
      this.currentTime = this.$refs.audio.currentTime = currentTime;
      if (!this.playing) {
        this.togglePlaying();
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000);
      }
    },
    middleTouchStart (e) {
      this.touch.initiated = true;
      // 用来判断是否是一次移动
      this.touch.moved = false;
      const touch = e.touches[0];
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pageY;
    },
    middleTouchMove (e) {
      if (!this.touch.initiated) {
        return;
      }
      const touch = e.touches[0];
      const deltaX = touch.pageX - this.touch.startX;
      const deltaY = touch.pageY - this.touch.startY;
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return;
      }
      if (!this.touch.moved) {
        this.touch.moved = true;
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth;
      const offsetWidth = Math.min(Math.max(-window.innerWidth, left + deltaX), 0);
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
      this.$refs.lyricList.$el.style[TRANSITION_DURATION] = '0ms';
      this.$refs.lyricList.$el.style[TRANSFORM] = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.middleL.style[TRANSITION_DURATION] = '0ms';
      this.$refs.middleL.style.opacity = 1 - this.touch.percent;
    },
    middleTouchEnd () {
      if (!this.touch.moved) {
        return;
      }
      let offsetWidth = 0;
      let opacity = 0;
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth;
          opacity = 0;
          this.currentShow = 'lyric';
        } else {
          offsetWidth = 0;
          opacity = 1;
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0;
          this.currentShow = 'cd';
          opacity = 1;
        } else {
          offsetWidth = -window.innerWidth;
          opacity = 0;
        }
      }
      const time = 300;
      this.$refs.lyricList.$el.style[TRANSFORM] = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.middleL.style.opacity = opacity;
      this.$refs.middleL.style[TRANSITION_DURATION] = `${time}ms`;
      this.$refs.lyricList.$el.style[TRANSITION_DURATION] = `${time}ms`;
      this.touch.initiated = false;
    },
    enter (el, done) {
      const { x, y, scale } = this._getPosAndStyle();

      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.2)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      };
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      });

      animations.runAnimation(this.$refs.cdWrapper, 'move', done);
    },
    afterEnter (el) {
      animations.unregisterAnimation('move');
      this.$refs.cdWrapper.style.animation = '';
    },
    leave (el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s';
      const { x, y, scale } = this._getPosAndStyle();
      // debugger;
      this.$refs.cdWrapper.style[TRANSFORM] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      this.$refs.cdWrapper.addEventListener('transitionend', done);
    },
    afterLeave (el) {
      this.$refs.cdWrapper.style.transition = '';
      this.$refs.cdWrapper.style[TRANSFORM] = '';
    },
    showPlaylist () {
      this.$refs.playlist.show();
    },
    _getPosAndStyle () {
      const targetWidth = 40;
      const paddingLeft = 40;
      const paddingBottom = 30;
      const paddingTop = 80;
      const width = window.innerWidth * 0.8;
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return { x, y, scale };
    },
    _getRotate (el) {
      let style = window.getComputedStyle(el);
      let transform = style.transform;
      let matrix = transform.split('(')[1].split(')')[0].split(',');
      let matrixA = Math.round(180 * Math.asin(matrix[0]) / Math.PI);
      let matrixB = Math.round(180 * Math.acos(matrix[1]) / Math.PI);
      let matrixC = Math.round(180 * Math.asin(matrix[2]) / Math.PI);
      let matrixD = Math.round(180 * Math.acos(matrix[3]) / Math.PI);
      let rotate = 0;
      if (matrixA === matrixB || -matrixA === matrixB) {
        rotate = matrixD;
      } else if (-matrixA + matrixB === 180) {
        rotate = 180 + matrixC;
      } else if (matrixA + matrixB === 180) {
        rotate = 360 - matrixC || 360 - matrixD;
      }
      return rotate;
    },
    _resetAnimation () {
      this.$refs.cdImage.style['animation-delay'] = '';
      this.$refs.miniImage.style['animation-delay'] = '';
    },
    _pad (num, n = 2) {
      let len = num.toString().length;
      while (len < n) {
        num = '0' + num;
        len++;
      }
      return num;
    },
    _getLyric () {
      this.currentSong.getLyric().then((lyric) => {
        this.currentLyric = new Lyric(lyric, this._handleLyric);
        this.isPureMusic = !this.currentLyric.lines.length;
        // if (this.playing) {
        //   this.currentLyric.play();
        // } else {
        //   this.currentLyric.stop();
        // }
        if (this.isPureMusic) {
          this.pureMusicLyric = this.currentLyric.lrc.replace(timeExp, '').trim();
          this.playingLyric = this.pureMusicLyric;
        } else {
          if (this.playing && this.canLyricPlay) {
            // 这个时候有可能用户已经播放了歌曲，要切到对应位置
            this.currentLyric.seek(this.currentTime * 1000);
          }
        }
      }).catch(() => {
        this.currentLyric = null;
        this.playingLyric = '';
        this.currentLineNum = 0;
      });
    },
    _handleLyric ({ lineNum, txt }) {
      if (!this.$refs.lyricLine) {
        return;
      }
      this.currentLineNum = lineNum;
      if (lineNum > 6) {
        let lineEl = this.$refs.lyricLine[lineNum - 6];
        this.$refs.lyricList.scrollToElement(lineEl, 1000);
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
      this.playingLyric = txt;
    },
    /**
       * 计算内层Image的transform，并同步到外层容器
       * @param wrapper
       * @param inner
       */
    syncWrapperTransform (wrapper, inner) {
      if (!this.$refs[wrapper]) {
        return;
      }
      let imageWrapper = this.$refs[wrapper];
      let image = this.$refs[inner];
      let wTransform = getComputedStyle(imageWrapper)[TRANSFORM];
      let iTransform = getComputedStyle(image)[TRANSFORM];
      imageWrapper.style[TRANSFORM] = wTransform === 'none' ? iTransform : iTransform.concat(' ', wTransform);
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN'
    }),
    ...mapActions([
      'savePlayHistory'
    ])
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (!newSong.id || !newSong.url || newSong.id === oldSong.id) {
        return;
      }
      this.songReady = false;
      this.canLyricPlay = false;
      if (this.currentLyric) {
        this.currentLyric.stop();
        // 重置为null
        this.currentLyric = null;
        this.currentTime = 0;
        this.playingLyric = '';
        this.currentLineNum = 0;
      }
      this.$refs.audio.src = newSong.url;
      this.$refs.audio.play();
      this._resetAnimation();
      this.$refs.background.style['background-image'] = `url(${this.currentSong.image})`;
      this.$refs.background.style['background-position'] = 'center center';
      this.$refs.background.style['background-size'] = 'cover';
      // 若歌曲 5s 未播放，则认为超时，修改状态确保可以切换歌曲。
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.songReady = true;
      }, 5000);
      this._getLyric();
      // setTimeout(() => {
      //   this.$refs.audio.play();
      //   this._resetAnimation();
      //   this._getLyric();
      // }, 1000);
    },
    playing (newPlaying) {
      if (!this.songReady) {
        return;
      }
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause();
      });
      if (!newPlaying) {
        if (this.fullScreen) {
          this.syncWrapperTransform('imageWrapper', 'image');
        } else {
          this.syncWrapperTransform('miniWrapper', 'miniImage');
        }
      }
    },
    fullScreen (newVal) {
      if (newVal) {
        setTimeout(() => {
          this.$refs.lyricList.refresh();
          this.$refs.progressBar.setProgressOffset(this.percent);
        }, 20);
      }
    }
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.player
  .normal-player
    position fixed
    left 0
    right 0
    bottom 0
    top 0
    z-index 150
    background $color-background
    .background
      position absolute
      left 0
      top 0
      width 100%
      height 100%
      z-index -1
      opacity 0.6
      filter blur(30px)
      // img
      //   width 100%
      //   height 100%
    .top
      position relative
      margin-bottom 25px
      .back
        position absolute
        top 0
        left 6px
        z-index 50
        .icon-back
          display block
          padding 9px
          font-size $font-size-large-x
          color $color-theme
          transform rotate(-90deg)
      .title
        width 70%
        margin 0 auto
        line-height 40px
        text-align center
        no-wrap()
        font-size $font-size-large
        color $color-text
      .subtitle
        line-height 20px
        text-align center
        font-size $font-size-medium
        color $color-text
    .middle
      position fixed
      width 100%
      top 80px
      bottom 170px
      white-space nowrap
      font-size 0
      .middle-l
        display inline-block
        vertical-align top
        position relative
        width 100%
        height 0
        padding-top 80%
        .cd-wrapper
          position absolute
          left 10%
          top 0
          width 80%
          height 100%
          .cd
            width 100%
            height 100%
            box-sizing border-box
            border 10px solid rgba(255, 255, 255, 0.1)
            border-radius 50%
            &.play
              animation rotate 20s linear infinite
            &.pause
              animation-play-state paused
            .image
              position absolute
              left 0
              top 0
              width 100%
              height 100%
              border-radius 50%
        .playing-lyric-wrapper
          width 80%
          margin 30px auto 0
          overflow hidden
          text-align center
          .playing-lyric
            height 20px
            line-height 20px
            font-size $font-size-medium
            color $color-text-l
      .middle-r
        display inline-block
        vertical-align top
        width 100%
        height 100%
        overflow hidden
        .lyric-wrapper
          width 80%
          margin 0 auto
          overflow hidden
          text-align center
          .text
            line-height 32px
            color $color-text-l
            font-size $font-size-medium
            &.current
              color $color-theme
          .pure-music
            padding-top 60%
            line-height 32px
            color $color-theme
            font-size $font-size-medium
    .bottom
      position absolute
      bottom 50px
      width 100%
      .dot-wrapper
        text-align center
        font-size 0
        .dot
          display inline-block
          vertical-align middle
          margin 0 4px
          width 8px
          height 8px
          border-radius 50%
          background $color-text-l
          &.active
            width 20px
            border-radius 5px
            background $color-text-ll
      .progress-wrapper
        display flex
        align-items center
        width 80%
        margin 0 auto
        padding 10px 0
        .time
          color $color-text
          font-size $font-size-small
          flex 0 0 40px
          line-height 30px
          width 40px
          &.time-l
            text-align left
          &.time-r
            text-align right
        .progress-bar-wrapper
          flex 1
      .operators
        display flex
        align-items center
        .icon
          flex 1
          color $color-theme
          &.disable
            color $color-theme-d
          i
            font-size 30px
        .i-left
          text-align right
        .i-center
          padding 0 20px
          text-align center
          i
            font-size 40px
        .i-right
          text-align left
        .icon-favorite
          color $color-sub-theme
    &.normal-enter-active, &.normal-leave-active
      transition all 0.4s
      .top, .bottom
        transition all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity 0
      visibility hidden
      .top
        transform translate3d(0, -100px, 0)
      .bottom
        transform translate3d(0, 100px, 0)
  .mini-player
    display flex
    align-items center
    position fixed
    left 0
    bottom 0
    z-index 180
    width 100%
    height 60px
    background $color-highlight-background
    &.mini-enter-active, &.mini-leave-active
      transition all 0.4s
    &.mini-enter, &.mini-leave-to
      opacity 0
      filter blur(10px)
      visibility hidden
    .icon
      flex 0 0 40px
      width 40px
      padding 0 10px 0 20px
      img
        border-radius 50%
        width 40px
        height 40px
        &.play
          animation rotate 20s linear infinite
        &.pause
          animation-play-state paused
    .text
      display flex
      flex-direction column
      justify-content center
      flex 1
      line-height 20px
      overflow hidden
      .name
        margin-bottom 2px
        no-wrap()
        font-size $font-size-medium
        color $color-text
      .desc
        no-wrap()
        font-size $font-size-small
        color $color-text-d
    .control
      flex 0 0 30px
      width 30px
      padding 0 10px
      .icon-play-mini, .icon-pause-mini, .icon-playlist
        font-size 30px
        color $color-theme-d
      .icon-mini
        font-size 32px
        position absolute
        left 0
        top 0
  @keyframes rotate
    0%
      transform rotate(0)
    100%
      transform rotate(360deg)
</style>
