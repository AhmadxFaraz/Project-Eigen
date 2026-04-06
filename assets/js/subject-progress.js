(function () {
  const SUBJECT_STORAGE_PREFIX = {
    'Applied-Mathematics-I': 'ams1112',
    'Applied-Mathematics-II': 'ams1122',
    'Higher-Mathematics-I': 'hm2612',
    'Higher-Mathematics-II': 'hm2520',
    'Discrete-Structures': 'ams2632',
    'Numerical-Techniques': 'am03510',
    'Advanced-Numerical-Methods': 'am04430'
  };

  function safeParse(key) {
    try {
      return JSON.parse(window.localStorage.getItem(key));
    } catch (_) {
      return null;
    }
  }

  function getCourseSlug() {
    const path = window.location.pathname || '';
    const segments = path.split('/').filter(Boolean);
    if (!segments.length) return '';

    const current = segments[segments.length - 1];
    const folder = /\.[a-z0-9]+$/i.test(current) ? segments[segments.length - 2] : current;
    return folder || '';
  }

  function getUnitNumber(card) {
    const href = card.getAttribute('href') || '';
    const match = href.match(/unit-(\d+)\.html/i);
    return match ? Number(match[1]) : null;
  }

  function countProgress(data) {
    if (!Array.isArray(data)) return { total: 0, completed: 0 };

    return data.reduce(function (acc, topic) {
      if (!topic || !Array.isArray(topic.tasks)) return acc;
      acc.total += topic.tasks.length;
      acc.completed += topic.tasks.filter(function (task) {
        return task && task.completed;
      }).length;
      return acc;
    }, { total: 0, completed: 0 });
  }

  function ensureProgressShell(card) {
    let shell = card.querySelector('.subject-unit-progress');
    if (shell) return shell;

    shell = document.createElement('div');
    shell.className = 'subject-unit-progress';
    shell.innerHTML = `
      <div class="subject-unit-progress-bar">
        <span></span>
      </div>
      <p class="subject-unit-progress-text">No local progress yet.</p>
    `;
    card.appendChild(shell);
    return shell;
  }

  function updateCard(card, storageKey) {
    const shell = ensureProgressShell(card);
    const bar = shell.querySelector('.subject-unit-progress-bar > span');
    const text = shell.querySelector('.subject-unit-progress-text');
    const progress = countProgress(safeParse(storageKey));
    const percent = progress.total === 0 ? 0 : Math.round((progress.completed / progress.total) * 100);

    if (bar) {
      bar.style.width = `${percent}%`;
    }

    if (!text) return;

    if (progress.total === 0) {
      text.textContent = 'No local progress yet. Open the unit to start tracking checkpoints.';
      return;
    }

    if (percent === 100) {
      text.textContent = `Complete locally. ${progress.completed}/${progress.total} checkpoints closed.`;
      return;
    }

    text.textContent = `${percent}% complete locally. ${progress.completed}/${progress.total} checkpoints done.`;
  }

  function initSubjectProgress() {
    if (!document.body || !document.body.classList.contains('subject-page')) return;

    const slug = getCourseSlug();
    const prefix = SUBJECT_STORAGE_PREFIX[slug];
    if (!prefix) return;

    const cards = Array.from(document.querySelectorAll('section.max-w-5xl > a[href^="unit-"]'));
    if (!cards.length) return;

    function refresh() {
      cards.forEach(function (card) {
        const unitNumber = getUnitNumber(card);
        if (!unitNumber) return;
        updateCard(card, `${prefix}_unit${unitNumber}_data`);
      });
    }

    refresh();
    window.addEventListener('storage', refresh);
  }

  document.addEventListener('DOMContentLoaded', initSubjectProgress);
})();
