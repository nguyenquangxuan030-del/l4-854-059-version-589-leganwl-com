(function () {
  var menuButton = document.querySelector('.menu-button');
  var mobileMenu = document.querySelector('.mobile-menu');
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var thumbs = Array.prototype.slice.call(document.querySelectorAll('[data-hero-thumb]'));
  var current = 0;
  var timer = null;

  function setHero(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === current);
    });
    thumbs.forEach(function (thumb, i) {
      thumb.classList.toggle('is-active', i === current);
    });
  }

  function startHeroTimer() {
    if (!slides.length) {
      return;
    }
    window.clearInterval(timer);
    timer = window.setInterval(function () {
      setHero(current + 1);
    }, 5000);
  }

  var prev = document.querySelector('.hero-prev');
  var next = document.querySelector('.hero-next');
  if (prev) {
    prev.addEventListener('click', function () {
      setHero(current - 1);
      startHeroTimer();
    });
  }
  if (next) {
    next.addEventListener('click', function () {
      setHero(current + 1);
      startHeroTimer();
    });
  }
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      setHero(Number(dot.getAttribute('data-hero-dot')) || 0);
      startHeroTimer();
    });
  });
  startHeroTimer();

  var filterInput = document.querySelector('[data-filter-input]');
  var filterType = document.querySelector('[data-filter-type]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card[data-title]'));

  function filterCards() {
    if (!filterInput && !filterType) {
      return;
    }
    var keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var type = filterType ? filterType.value : '';
    cards.forEach(function (card) {
      var text = (card.getAttribute('data-title') + ' ' + card.getAttribute('data-tags')).toLowerCase();
      var matchesKeyword = !keyword || text.indexOf(keyword) !== -1;
      var matchesType = !type || text.indexOf(type.toLowerCase()) !== -1;
      card.style.display = matchesKeyword && matchesType ? '' : 'none';
    });
  }

  if (filterInput) {
    filterInput.addEventListener('input', filterCards);
  }
  if (filterType) {
    filterType.addEventListener('change', filterCards);
  }

  var searchRoot = document.querySelector('[data-search-root]');
  if (searchRoot && window.__MOVIE_LIST__) {
    var form = searchRoot.querySelector('form');
    var input = searchRoot.querySelector('input[name="q"]');
    var results = document.querySelector('[data-search-results]');
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    input.value = initial;

    function escapeHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function renderSearch(value) {
      var query = value.trim().toLowerCase();
      var list = window.__MOVIE_LIST__;
      var matched = query
        ? list.filter(function (item) {
            return (item.title + ' ' + item.oneLine + ' ' + item.genre + ' ' + item.tags + ' ' + item.region + ' ' + item.year).toLowerCase().indexOf(query) !== -1;
          }).slice(0, 80)
        : list.slice(0, 24);
      results.innerHTML = matched.map(function (item) {
        return '<a class="search-result-card" href="' + item.url + '">' +
          '<img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" onerror="this.style.display=\'none\'">' +
          '<div><h3>' + escapeHtml(item.title) + '</h3>' +
          '<p>' + escapeHtml(item.year + ' · ' + item.region + ' · ' + item.genre) + '</p>' +
          '<p>' + escapeHtml(item.oneLine) + '</p></div>' +
          '</a>';
      }).join('');
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var query = input.value.trim();
      var url = query ? './search.html?q=' + encodeURIComponent(query) : './search.html';
      window.history.replaceState({}, '', url);
      renderSearch(query);
    });
    input.addEventListener('input', function () {
      renderSearch(input.value);
    });
    renderSearch(initial);
  }
})();
