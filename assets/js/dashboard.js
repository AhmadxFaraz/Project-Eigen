(function () {
  function safeParse(key) {
    try {
      return JSON.parse(window.localStorage.getItem(key));
    } catch (_) {
      return null;
    }
  }

  function countChecklistProgress(value) {
    if (!Array.isArray(value)) {
      return { total: 0, completed: 0 };
    }

    return value.reduce(function (acc, item) {
      if (item && Array.isArray(item.tasks)) {
        acc.total += item.tasks.length;
        acc.completed += item.tasks.filter(function (task) {
          return task && task.completed;
        }).length;
        return acc;
      }

      if (item && Array.isArray(item.topics)) {
        acc.total += item.topics.length;
        acc.completed += item.topics.filter(function (topic) {
          return topic && topic.completed;
        }).length;
      }

      return acc;
    }, { total: 0, completed: 0 });
  }

  function getCardProgress(card) {
    const keys = String(card.dataset.storageKeys || '')
      .split(',')
      .map(function (value) { return value.trim(); })
      .filter(Boolean);

    const aggregate = keys.reduce(function (acc, key) {
      const data = safeParse(key);
      const progress = countChecklistProgress(data);
      acc.total += progress.total;
      acc.completed += progress.completed;
      if (progress.total > 0) {
        acc.activeKeys += 1;
      }
      return acc;
    }, { total: 0, completed: 0, activeKeys: 0 });

    const percent = aggregate.total === 0 ? 0 : Math.round((aggregate.completed / aggregate.total) * 100);

    return {
      keys: keys.length,
      activeKeys: aggregate.activeKeys,
      total: aggregate.total,
      completed: aggregate.completed,
      percent: percent
    };
  }

  function updateCardProgress(card, progress) {
    const bar = card.querySelector('.dashboard-card-progress-bar > span');
    const text = card.querySelector('.dashboard-card-progress-text');
    if (bar) {
      bar.style.width = percentWidth(progress.percent);
    }

    if (!text) return;

    if (progress.total === 0) {
      text.textContent = `No local progress yet. ${progress.keys} study block${progress.keys === 1 ? '' : 's'} waiting.`;
      return;
    }

    if (progress.percent === 100) {
      text.textContent = `Complete locally. ${progress.completed}/${progress.total} checkpoints closed.`;
      return;
    }

    text.textContent = `${progress.percent}% complete locally. ${progress.completed}/${progress.total} checkpoints done.`;
  }

  function percentWidth(percent) {
    return `${Math.max(0, Math.min(100, percent))}%`;
  }

  function applySearch(cards, query) {
    const normalized = String(query || '').trim().toLowerCase();
    let visible = 0;

    cards.forEach(function (card) {
      const haystack = String(card.dataset.search || '').toLowerCase();
      const matches = !normalized || haystack.includes(normalized);
      card.classList.toggle('is-hidden', !matches);
      if (matches) visible += 1;
    });

    return visible;
  }

  function updateToolbar(cards, visibleCount) {
    const visibleLabel = document.getElementById('dashboard-visible-label');
    const activeLabel = document.getElementById('dashboard-active-label');
    const progressDetail = document.getElementById('dashboard-progress-detail');
    const progressBar = document.getElementById('dashboard-progress-bar-fill');

    const visibleCards = cards.filter(function (card) {
      return !card.classList.contains('is-hidden');
    });

    const totals = visibleCards.reduce(function (acc, card) {
      const progress = getCardProgress(card);
      acc.cardCount += 1;
      acc.activePaths += progress.percent > 0 ? 1 : 0;
      acc.percentSum += progress.percent;
      return acc;
    }, { cardCount: 0, activePaths: 0, percentSum: 0 });

    const averagePercent = totals.cardCount === 0 ? 0 : Math.round(totals.percentSum / totals.cardCount);

    if (visibleLabel) {
      visibleLabel.textContent = `${visibleCount} path${visibleCount === 1 ? '' : 's'} visible`;
    }

    if (activeLabel) {
      activeLabel.textContent = `${totals.activePaths} active locally`;
    }

    if (progressBar) {
      progressBar.style.width = percentWidth(averagePercent);
    }

    if (progressDetail) {
      if (visibleCount === 0) {
        progressDetail.textContent = 'No matching paths. Try a broader search phrase.';
      } else if (totals.activePaths === 0) {
        progressDetail.textContent = 'No local progress detected yet.';
      } else {
        progressDetail.textContent = `Average visible-path completion: ${averagePercent}%.`;
      }
    }
  }

  function toggleEmptyState(visibleCount) {
    let empty = document.getElementById('dashboard-empty-state');
    if (!empty) {
      empty = document.createElement('div');
      empty.id = 'dashboard-empty-state';
      empty.className = 'dashboard-empty-state';
      empty.innerHTML = '<p class="text-base font-semibold text-white">No matching study paths</p><p class="mt-2 text-sm text-slate-400">Try searching by acronym, topic family, or a broader keyword like calculus, graph theory, or finance.</p>';
      const grid = document.getElementById('dashboard-grid');
      if (grid) {
        grid.appendChild(empty);
      }
    }

    empty.classList.toggle('is-visible', visibleCount === 0);
  }

  function initDashboard() {
    const grid = document.getElementById('dashboard-grid');
    const input = document.getElementById('dashboard-search');
    if (!grid || !input) return;

    const cards = Array.from(grid.querySelectorAll('.dashboard-card'));
    if (!cards.length) return;

    cards.forEach(function (card) {
      updateCardProgress(card, getCardProgress(card));
    });

    function refresh() {
      const visibleCount = applySearch(cards, input.value);
      updateToolbar(cards, visibleCount);
      toggleEmptyState(visibleCount);
    }

    input.addEventListener('input', refresh);
    window.addEventListener('storage', function () {
      cards.forEach(function (card) {
        updateCardProgress(card, getCardProgress(card));
      });
      refresh();
    });

    refresh();
  }

  document.addEventListener('DOMContentLoaded', initDashboard);
})();
