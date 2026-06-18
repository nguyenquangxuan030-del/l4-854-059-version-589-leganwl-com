(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");

    if (toggle && panel) {
        toggle.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, position) {
                slide.classList.toggle("is-active", position === current);
            });

            dots.forEach(function (dot, position) {
                dot.classList.toggle("is-active", position === current);
            });
        }

        function startTimer() {
            clearInterval(timer);
            timer = setInterval(function () {
                showSlide(current + 1);
            }, 5000);
        }

        if (prev) {
            prev.addEventListener("click", function () {
                showSlide(current - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                showSlide(current + 1);
                startTimer();
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
                startTimer();
            });
        });

        showSlide(0);
        startTimer();
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function runFilter(root) {
        var input = root.querySelector(".page-filter-input");
        var active = root.querySelector(".filter-chip.is-active");
        var filterValue = active ? active.getAttribute("data-filter-value") : "all";
        var query = input ? normalize(input.value) : "";
        var cards = Array.prototype.slice.call(root.querySelectorAll("[data-card]"));
        var visible = 0;

        cards.forEach(function (card) {
            var text = normalize(card.getAttribute("data-search") + " " + card.textContent);
            var pool = normalize(card.getAttribute("data-filter") + " " + card.textContent);
            var matchQuery = !query || text.indexOf(query) !== -1;
            var matchFilter = filterValue === "all" || pool.indexOf(normalize(filterValue)) !== -1;
            var show = matchQuery && matchFilter;

            card.style.display = show ? "" : "none";

            if (show) {
                visible += 1;
            }
        });

        var empty = root.querySelector("[data-empty-state]");
        if (empty) {
            empty.classList.toggle("is-visible", visible === 0);
        }
    }

    Array.prototype.slice.call(document.querySelectorAll("[data-filter-root]")).forEach(function (root) {
        var input = root.querySelector(".page-filter-input");
        var chips = Array.prototype.slice.call(root.querySelectorAll(".filter-chip"));
        var urlQuery = new URLSearchParams(window.location.search).get("q");

        if (input && urlQuery) {
            input.value = urlQuery;
        }

        if (input) {
            input.addEventListener("input", function () {
                runFilter(root);
            });
        }

        chips.forEach(function (chip) {
            chip.addEventListener("click", function () {
                chips.forEach(function (item) {
                    item.classList.remove("is-active");
                });
                chip.classList.add("is-active");
                runFilter(root);
            });
        });

        runFilter(root);
    });

    var urlQuery = new URLSearchParams(window.location.search).get("q");
    if (urlQuery) {
        Array.prototype.slice.call(document.querySelectorAll(".global-search-input")).forEach(function (input) {
            if (!input.value) {
                input.value = urlQuery;
            }
        });
    }
})();
