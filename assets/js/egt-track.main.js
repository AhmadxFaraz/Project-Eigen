(function () {
  const STORAGE_KEY = 'egt_track_data';
  const ACTIVE_FILTER_CLASS = 'egt-filter-btn is-active';
  const INACTIVE_FILTER_CLASS = 'egt-filter-btn';

  const sectionAccentMap = {
    cyan: {
      line: 'bg-cyan-300',
      badge: 'bg-cyan-500/15 text-cyan-200 border border-cyan-400/25'
    },
    indigo: {
      line: 'bg-indigo-300',
      badge: 'bg-indigo-500/15 text-indigo-200 border border-indigo-400/25'
    },
    purple: {
      line: 'bg-violet-300',
      badge: 'bg-violet-500/15 text-violet-200 border border-violet-400/25'
    },
    amber: {
      line: 'bg-amber-300',
      badge: 'bg-amber-500/15 text-amber-200 border border-amber-400/25'
    }
  };

  function storageApi() {
    return window.TrackerStorage || {
      deepCopy: function (value) { return JSON.parse(JSON.stringify(value)); },
      read: function (key) {
        try { return JSON.parse(localStorage.getItem(key)); } catch (_) { return null; }
      },
      save: function (key, value) { localStorage.setItem(key, JSON.stringify(value)); },
      markLocalWrite: function () {},
      getLocalWriteTime: function () { return null; }
    };
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function ensureSyncBadge() {
    let badge = document.getElementById('sync-status-badge');
    if (badge) return badge;
    badge = document.createElement('div');
    badge.id = 'sync-status-badge';
    badge.style.position = 'fixed';
    badge.style.right = '12px';
    badge.style.bottom = '12px';
    badge.style.zIndex = '9999';
    badge.style.padding = '6px 10px';
    badge.style.borderRadius = '8px';
    badge.style.fontSize = '12px';
    badge.style.fontFamily = 'JetBrains Mono, monospace';
    badge.style.background = 'rgba(8, 18, 36, 0.88)';
    badge.style.border = '1px solid rgba(249, 115, 22, 0.4)';
    badge.style.color = '#fdba74';
    badge.style.maxWidth = '340px';
    badge.style.pointerEvents = 'none';
    badge.textContent = 'Cloud Sync: checking...';
    document.body.appendChild(badge);
    return badge;
  }

  function setSyncStatus(text, isError) {
    const badge = ensureSyncBadge();
    badge.textContent = 'Cloud Sync: ' + text;
    if (isError) {
      badge.style.borderColor = 'rgba(248, 113, 113, 0.7)';
      badge.style.color = '#fca5a5';
    } else {
      badge.style.borderColor = 'rgba(249, 115, 22, 0.4)';
      badge.style.color = '#fdba74';
    }
  }

  function countCompleted(data) {
    let completed = 0;
    data.forEach(function (section) {
      section.topics.forEach(function (topic) {
        if (topic.completed) completed += 1;
      });
    });
    return completed;
  }

  function getCounts(data) {
    let totalTopics = 0;
    let completedTopics = 0;
    let completedSections = 0;

    data.forEach(function (section) {
      totalTopics += section.topics.length;
      const doneInSection = section.topics.filter(function (topic) { return topic.completed; }).length;
      completedTopics += doneInSection;
      if (section.topics.length && doneInSection === section.topics.length) {
        completedSections += 1;
      }
    });

    return {
      totalTopics: totalTopics,
      completedTopics: completedTopics,
      completedSections: completedSections,
      percent: totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100)
    };
  }

  function resolveInitialData() {
    const storage = storageApi();
    const saved = storage.read(STORAGE_KEY);
    if (saved) return saved;
    return storage.deepCopy(trackData);
  }

  const app = {
    data: resolveInitialData(),
    filter: 'all',

    save: function () {
      const storage = storageApi();
      storage.save(STORAGE_KEY, this.data);
      if (storage.markLocalWrite) {
        storage.markLocalWrite(STORAGE_KEY);
      }
      this.renderStats();
      this.renderSections();
      this.pushWithRetry(3);
    },

    toggleTopic: function (sectionIndex, topicIndex) {
      this.data[sectionIndex].topics[topicIndex].completed = !this.data[sectionIndex].topics[topicIndex].completed;
      this.save();
    },

    setFilter: function (filterType) {
      this.filter = filterType;
      this.updateFilterButtons();
      this.renderSections();
    },

    resetProgress: function () {
      if (!confirm('Are you sure you want to reset all progress for this track?')) return;
      this.data = storageApi().deepCopy(trackData);
      this.save();
    },

    updateFilterButtons: function () {
      ['all', 'incomplete', 'completed'].forEach(function (type) {
        const btn = document.getElementById('btn-' + type);
        if (!btn) return;
        btn.className = type === app.filter ? ACTIVE_FILTER_CLASS : INACTIVE_FILTER_CLASS;
      });
    },

    renderStats: function () {
      const counts = getCounts(this.data);
      document.getElementById('stat-total-topics').textContent = String(counts.totalTopics);
      document.getElementById('stat-completed-topics').textContent = String(counts.completedTopics);
      document.getElementById('stat-completed-sections').textContent = counts.completedSections + '/' + this.data.length;
      document.getElementById('stat-percent').textContent = counts.percent + '%';

      const motivation = document.getElementById('egt-motivation');
      if (counts.percent === 0) motivation.textContent = 'Structure begins before progress does.';
      else if (counts.percent < 25) motivation.textContent = 'The map is getting clearer.';
      else if (counts.percent < 50) motivation.textContent = 'You are now building actual strategic intuition.';
      else if (counts.percent < 75) motivation.textContent = 'This is starting to look like a serious track.';
      else if (counts.percent < 100) motivation.textContent = 'Almost there. Keep the sharp edges.';
      else motivation.textContent = 'Built with depth, not just decoration.';

      const featured = this.data.find(function (section) { return section.id === 'real-world-applications'; });
      const strip = document.getElementById('featured-application-strip');
      if (strip && featured) {
        strip.innerHTML = featured.topics.map(function (topic) {
          return '<span class="egt-chip">' + escapeHtml(topic.title) + '</span>';
        }).join('');
      }
    },

    renderSections: function () {
      const target = document.getElementById('egt-sections');
      if (!target) return;

      const html = this.data.map(function (section, sectionIndex) {
        const filteredTopics = section.topics.filter(function (topic) {
          if (app.filter === 'completed') return topic.completed;
          if (app.filter === 'incomplete') return !topic.completed;
          return true;
        });

        if (!filteredTopics.length) return '';

        const done = section.topics.filter(function (topic) { return topic.completed; }).length;
        const accent = sectionAccentMap[section.color] || sectionAccentMap.cyan;

        const topicsHtml = filteredTopics.map(function (topic) {
          const topicIndex = section.topics.findIndex(function (item) { return item.id === topic.id; });
          const subtopics = topic.subtopics.map(function (item) {
            return '<span class="egt-subtopic-pill">' + escapeHtml(item) + '</span>';
          }).join('');
          const mathChips = topic.mathUsed.map(function (item) {
            return '<span class="egt-math-chip">' + escapeHtml(item) + '</span>';
          }).join('');
          const linked = Array.isArray(topic.linkedConcepts) && topic.linkedConcepts.length
            ? '<div><div class="egt-label mb-2">Linked Concepts</div><div class="flex flex-wrap gap-2">' + topic.linkedConcepts.map(function (item) {
                return '<span class="egt-linked-chip">' + escapeHtml(item) + '</span>';
              }).join('') + '</div></div>'
            : '';
          const example = topic.example
            ? '<div><div class="egt-label mb-2">Example</div><p class="text-sm text-slate-300 leading-6">' + escapeHtml(topic.example) + '</p></div>'
            : '';

          return (
            '<div class="egt-topic-card' + (topic.completed ? ' is-complete' : '') + '">' +
              '<div class="flex items-start gap-3">' +
                '<input type="checkbox" class="egt-topic-toggle" ' + (topic.completed ? 'checked ' : '') + 'onchange="window.egtTrack.toggleTopic(' + sectionIndex + ', ' + topicIndex + ')">' +
                '<div class="min-w-0 flex-1">' +
                  '<div class="flex flex-wrap items-center gap-2">' +
                    '<h4 class="text-lg font-semibold text-white leading-tight">' + escapeHtml(topic.title) + '</h4>' +
                  '</div>' +
                  '<div class="egt-topic-meta">' +
                    '<div><div class="egt-label mb-2">Subtopics</div><div class="egt-subtopic-list">' + subtopics + '</div></div>' +
                    '<div><div class="egt-label mb-2">Use Case</div><p class="text-sm text-slate-300 leading-6">' + escapeHtml(topic.useCase) + '</p></div>' +
                    '<div><div class="egt-label mb-2">Math Used</div><div class="flex flex-wrap gap-2">' + mathChips + '</div></div>' +
                    example +
                    linked +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>'
          );
        }).join('');

        return (
          '<section class="animated-border egt-section-card">' +
            '<div class="h-1.5 ' + accent.line + '"></div>' +
            '<div class="egt-section-header">' +
              '<div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">' +
                '<div>' +
                  '<div class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ' + accent.badge + '">' + escapeHtml(section.title) + '</div>' +
                  '<p class="mt-3 text-sm text-slate-300 leading-6 max-w-3xl">' + escapeHtml(section.description) + '</p>' +
                '</div>' +
                '<div class="text-xs mono text-slate-400 shrink-0">' + done + '/' + section.topics.length + ' complete</div>' +
              '</div>' +
            '</div>' +
            '<div class="egt-section-body">' +
              '<div class="egt-topic-grid">' + topicsHtml + '</div>' +
            '</div>' +
          '</section>'
        );
      }).join('');

      target.innerHTML = html || '<div class="egt-empty-state">No topics found for this filter.</div>';
    },

    async pushWithRetry(tries) {
      if (!window.TrackerCloud || !window.TrackerCloud.push) return false;
      const maxTries = typeof tries === 'number' ? tries : 3;
      for (let attempt = 1; attempt <= maxTries; attempt += 1) {
        const ok = await window.TrackerCloud.push(STORAGE_KEY, this.data);
        if (ok) {
          setSyncStatus('saved (attempt ' + attempt + ')', false);
          return true;
        }
        await new Promise(function (resolve) {
          setTimeout(resolve, attempt * 500);
        });
      }
      const errorText = window.TrackerCloud.getLastError ? window.TrackerCloud.getLastError() : '';
      setSyncStatus(errorText || 'save failed', true);
      return false;
    },

    async tryCloudPull() {
      if (!window.TrackerCloud || !window.TrackerCloud.pull) return;
      const user = await window.TrackerCloud.getUser();
      if (!user) {
        const errorText = window.TrackerCloud.getLastError ? window.TrackerCloud.getLastError() : '';
        setSyncStatus(errorText || 'not signed in', true);
        return;
      }

      setSyncStatus('signed in as ' + user.email, false);
      const remote = await window.TrackerCloud.pull(STORAGE_KEY);
      if (remote && remote.data) {
        const storage = storageApi();
        const localWriteAt = storage.getLocalWriteTime ? storage.getLocalWriteTime(STORAGE_KEY) : null;
        const remoteTime = remote.updatedAt ? Date.parse(remote.updatedAt) : 0;
        const localTime = localWriteAt ? Date.parse(localWriteAt) : 0;

        if (!localWriteAt || remoteTime >= localTime) {
          this.data = remote.data;
          storage.save(STORAGE_KEY, this.data);
          if (storage.markLocalWrite && remote.updatedAt) {
            storage.markLocalWrite(STORAGE_KEY, remote.updatedAt);
          }
          this.renderStats();
          this.renderSections();
          setSyncStatus('loaded from cloud', false);
          return;
        }

        await this.pushWithRetry(3);
        return;
      }

      if (countCompleted(this.data) > 0) {
        await this.pushWithRetry(3);
      } else {
        setSyncStatus('no cloud data yet for this track', false);
      }
    },

    bindCloudAuthSync() {
      if (!window.SupabaseClient || !window.SupabaseClient.isConfigured()) return;
      const client = window.SupabaseClient.getClient();
      if (!client || !client.auth) return;

      client.auth.onAuthStateChange(function () {
        app.tryCloudPull();
      });

      setTimeout(function () {
        app.tryCloudPull();
      }, 600);

      setTimeout(function () {
        app.tryCloudPull();
      }, 1800);

      setInterval(function () {
        app.tryCloudPull();
      }, 15000);
    },

    init() {
      document.getElementById('btn-all').addEventListener('click', function () { app.setFilter('all'); });
      document.getElementById('btn-incomplete').addEventListener('click', function () { app.setFilter('incomplete'); });
      document.getElementById('btn-completed').addEventListener('click', function () { app.setFilter('completed'); });
      document.getElementById('reset-track-btn').addEventListener('click', function () { app.resetProgress(); });

      this.updateFilterButtons();
      this.renderStats();
      this.renderSections();
      setSyncStatus('initializing...', false);
      this.bindCloudAuthSync();
      this.tryCloudPull();
    }
  };

  window.egtTrack = app;

  document.addEventListener('DOMContentLoaded', function () {
    app.init();
  });
})();
