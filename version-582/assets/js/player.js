(function () {
    window.createMoviePlayer = function (options) {
        var video = document.getElementById(options.videoId);
        var cover = document.getElementById(options.overlayId);
        var button = document.getElementById(options.buttonId);
        var source = options.source;
        var started = false;
        var hls = null;

        if (!video || !cover || !button || !source) {
            return;
        }

        function begin() {
            if (started) {
                video.play().catch(function () {});
                return;
            }

            started = true;
            cover.classList.add("is-hidden");
            video.controls = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
                video.load();
                video.play().catch(function () {});
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, function () {
                    video.play().catch(function () {});
                });
                hls.on(Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal && hls) {
                        hls.destroy();
                        hls = null;
                        video.src = source;
                        video.load();
                    }
                });
                return;
            }

            video.src = source;
            video.load();
            video.play().catch(function () {});
        }

        cover.addEventListener("click", begin);
        button.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            begin();
        });
        video.addEventListener("click", function () {
            if (!started) {
                begin();
            }
        });
    };
})();
