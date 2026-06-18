import { H as Hls } from './hls.js';

export function initPlayer(src) {
  var root = document.querySelector('.js-player');
  if (!root) {
    return;
  }

  var video = root.querySelector('.js-video');
  var play = root.querySelector('.js-play');
  var ready = false;
  var hls = null;

  function attach() {
    if (ready || !video) {
      return;
    }

    ready = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      return;
    }

    if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      return;
    }

    root.classList.add('player-unavailable');
  }

  function start() {
    attach();
    if (play) {
      play.classList.add('is-hidden');
    }
    video.setAttribute('controls', 'controls');
    var started = video.play();
    if (started && typeof started.catch === 'function') {
      started.catch(function () {
        if (play) {
          play.classList.remove('is-hidden');
        }
      });
    }
  }

  if (play) {
    play.addEventListener('click', start);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (!ready || video.paused) {
        start();
      } else {
        video.pause();
      }
    });
  }

  attach();

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
}
