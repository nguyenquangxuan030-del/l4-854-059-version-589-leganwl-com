(function () {
  var toggle = document.querySelector('.mobile-toggle');
  var panel = document.querySelector('.mobile-panel');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      var open = !panel.hasAttribute('hidden');
      if (open) {
        panel.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
      } else {
        panel.removeAttribute('hidden');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var prev = document.querySelector('.hero-prev');
  var next = document.querySelector('.hero-next');
  var current = 0;

  function showSlide(index) {
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
  }

  if (slides.length) {
    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
      });
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5000);
  }

  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get('q') || '';
  var queryInput = document.querySelector('.page-filter-input');
  var yearSelect = document.querySelector('.page-filter-select');
  var categorySelect = document.querySelector('.page-filter-category');
  var list = document.querySelector('.page-filter-list');
  var empty = document.querySelector('.empty-result');

  if (queryInput && initialQuery) {
    queryInput.value = initialQuery;
  }

  function cardText(card) {
    return [
      card.getAttribute('data-title'),
      card.getAttribute('data-region'),
      card.getAttribute('data-genre'),
      card.getAttribute('data-year'),
      card.getAttribute('data-category'),
      card.textContent
    ].join(' ').toLowerCase();
  }

  function filterCards() {
    if (!list) {
      return;
    }
    var query = queryInput ? queryInput.value.trim().toLowerCase() : '';
    var year = yearSelect ? yearSelect.value : '';
    var category = categorySelect ? categorySelect.value : '';
    var cards = Array.prototype.slice.call(list.querySelectorAll('.searchable-card'));
    var visible = 0;

    cards.forEach(function (card) {
      var text = cardText(card);
      var matchesQuery = !query || text.indexOf(query) !== -1;
      var matchesYear = !year || card.getAttribute('data-year') === year;
      var matchesCategory = !category || card.getAttribute('data-category') === category;
      var show = matchesQuery && matchesYear && matchesCategory;
      card.hidden = !show;
      if (show) {
        visible += 1;
      }
    });

    if (empty) {
      empty.hidden = visible !== 0;
    }
  }

  if (queryInput || yearSelect || categorySelect) {
    if (queryInput) {
      queryInput.addEventListener('input', filterCards);
    }
    if (yearSelect) {
      yearSelect.addEventListener('change', filterCards);
    }
    if (categorySelect) {
      categorySelect.addEventListener('change', filterCards);
    }
    filterCards();
  }
})();
