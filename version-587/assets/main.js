(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
        } else {
            document.addEventListener("DOMContentLoaded", callback);
        }
    }

    ready(function () {
        var toggle = document.querySelector(".menu-toggle");
        var panel = document.querySelector(".mobile-panel");

        if (toggle && panel) {
            toggle.addEventListener("click", function () {
                panel.classList.toggle("is-open");
            });
        }

        document.querySelectorAll(".site-search-form").forEach(function (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var input = form.querySelector("input[name='q']");
                var value = input ? input.value.trim() : "";

                if (value) {
                    window.location.href = form.getAttribute("action") + "?q=" + encodeURIComponent(value);
                }
            });
        });

        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        var current = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === current);
            });

            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === current);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
            });
        });

        if (slides.length > 1) {
            showSlide(0);
            window.setInterval(function () {
                showSlide(current + 1);
            }, 5600);
        }

        var filterInput = document.querySelector(".page-filter-input");
        var categoryCards = Array.prototype.slice.call(document.querySelectorAll(".category-movie-card"));

        if (filterInput && categoryCards.length) {
            filterInput.addEventListener("input", function () {
                var value = filterInput.value.trim().toLowerCase();

                categoryCards.forEach(function (card) {
                    var text = card.innerText.toLowerCase();
                    card.style.display = !value || text.indexOf(value) !== -1 ? "" : "none";
                });
            });
        }

        var searchPageInput = document.querySelector(".search-panel input[name='q']");
        var searchCards = Array.prototype.slice.call(document.querySelectorAll(".search-card"));
        var empty = document.querySelector(".search-empty");

        function filterSearch() {
            if (!searchPageInput || !searchCards.length) {
                return;
            }

            var value = searchPageInput.value.trim().toLowerCase();
            var shown = 0;

            searchCards.forEach(function (card) {
                var text = (card.getAttribute("data-search") || card.innerText).toLowerCase();
                var matched = !value || text.indexOf(value) !== -1;
                card.style.display = matched ? "" : "none";

                if (matched) {
                    shown += 1;
                }
            });

            if (empty) {
                empty.classList.toggle("is-visible", shown === 0);
            }
        }

        if (searchPageInput) {
            var params = new URLSearchParams(window.location.search);
            var q = params.get("q") || "";
            searchPageInput.value = q;
            searchPageInput.addEventListener("input", filterSearch);
            filterSearch();
        }
    });
})();
