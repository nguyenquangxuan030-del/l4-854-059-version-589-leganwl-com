(function () {
  var video = document.getElementById('movie-player');
  if (!video) {
    return;
  }
  var url = video.getAttribute('data-video');
  var cover = document.querySelector('.watch-cover');
  var ready = false;
  var hls = null;

  function bindVideo() {
    if (ready || !url) {
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(url);
      hls.attachMedia(video);
    } else {
      video.src = url;
    }
    ready = true;
  }

  function begin() {
    bindVideo();
    if (cover) {
      cover.classList.add('is-hidden');
    }
    var playPromise = video.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(function () {});
    }
  }

  if (cover) {
    cover.addEventListener('click', begin);
  }
  video.addEventListener('play', bindVideo);
  video.addEventListener('click', function () {
    if (video.paused) {
      begin();
    }
  });
  window.addEventListener('pagehide', function () {
    if (hls) {
      hls.destroy();
    }
  });
})();
