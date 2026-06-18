import { H as Hls } from "./hls.js";

export function initMoviePlayer(options) {
    var video = options.video;
    var button = options.button;
    var shell = options.shell;
    var source = options.source;
    var hls = null;
    var attached = false;

    function attachSource() {
        if (attached || !video || !source) {
            return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
        } else if (Hls && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
        } else {
            video.src = source;
        }

        attached = true;
    }

    function start() {
        attachSource();

        if (shell) {
            shell.classList.add("is-playing");
        }

        var promise = video.play();

        if (promise && typeof promise.catch === "function") {
            promise.catch(function () {});
        }
    }

    if (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            start();
        });
    }

    if (shell) {
        shell.addEventListener("click", function (event) {
            if (event.target === shell || event.target.closest(".play-overlay")) {
                start();
            }
        });
    }

    if (video) {
        video.addEventListener("play", function () {
            if (shell) {
                shell.classList.add("is-playing");
            }
        });

        video.addEventListener("ended", function () {
            if (shell) {
                shell.classList.remove("is-playing");
            }
        });
    }

    window.addEventListener("pagehide", function () {
        if (hls) {
            hls.destroy();
            hls = null;
        }
    });
}
