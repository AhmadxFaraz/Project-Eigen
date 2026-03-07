(function () {
  function createStudyTrackerApp(config) {
    const storageKey = config.storageKey;
    const fallbackStorageKeys = Array.isArray(config.fallbackStorageKeys) ? config.fallbackStorageKeys : [];
    const seedData = config.studyData;
    const storage = window.TrackerStorage;

    function resolveInitialData() {
      const primary = storage.read(storageKey);
      if (primary) return primary;

      for (let i = 0; i < fallbackStorageKeys.length; i++) {
        const fallbackKey = fallbackStorageKeys[i];
        const fallbackData = storage.read(fallbackKey);
        if (fallbackData) {
          storage.save(storageKey, fallbackData);
          return fallbackData;
        }
      }

      return storage.deepCopy(seedData);
    }

    function countCompleted(data) {
      if (!Array.isArray(data)) return 0;
      let completed = 0;
      data.forEach(function (topic) {
        if (!topic || !Array.isArray(topic.tasks)) return;
        topic.tasks.forEach(function (task) {
          if (task && task.completed) completed += 1;
        });
      });
      return completed;
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
      badge.style.border = '1px solid rgba(34, 211, 238, 0.45)';
      badge.style.color = '#67e8f9';
      badge.style.maxWidth = '320px';
      badge.style.pointerEvents = 'none';
      badge.textContent = 'Cloud Sync: checking...';
      document.body.appendChild(badge);
      return badge;
    }

    function setSyncStatus(text, isError) {
      const badge = ensureSyncBadge();
      badge.textContent = `Cloud Sync: ${text}`;
      if (isError) {
        badge.style.borderColor = 'rgba(248, 113, 113, 0.7)';
        badge.style.color = '#fca5a5';
      } else {
        badge.style.borderColor = 'rgba(34, 211, 238, 0.45)';
        badge.style.color = '#67e8f9';
      }
    }

    async function pushWithRetry(storageKeyValue, data, tries) {
      if (!window.TrackerCloud || !window.TrackerCloud.push) return false;
      const maxTries = typeof tries === 'number' ? tries : 3;
      for (let attempt = 1; attempt <= maxTries; attempt++) {
        const ok = await window.TrackerCloud.push(storageKeyValue, data);
        if (ok) {
          setSyncStatus(`saved (attempt ${attempt})`, false);
          return true;
        }
        await new Promise(function (resolve) {
          setTimeout(resolve, attempt * 500);
        });
      }
      const errorText = window.TrackerCloud.getLastError ? window.TrackerCloud.getLastError() : '';
      setSyncStatus(errorText || 'save failed', true);
      return false;
    }

    async function tryCloudPull(app) {
      if (!window.TrackerCloud || !window.TrackerCloud.pull) return;
      const user = await window.TrackerCloud.getUser();
      if (!user) {
        const errorText = window.TrackerCloud.getLastError ? window.TrackerCloud.getLastError() : '';
        setSyncStatus(errorText || 'not signed in', true);
        return;
      }

      setSyncStatus(`signed in as ${user.email}`, false);
      const remote = await window.TrackerCloud.pull(storageKey);
      if (remote && remote.data) {
        const localWriteAt = storage.getLocalWriteTime ? storage.getLocalWriteTime(storageKey) : null;
        const remoteTime = remote.updatedAt ? Date.parse(remote.updatedAt) : 0;
        const localTime = localWriteAt ? Date.parse(localWriteAt) : 0;

        // Apply whichever version is newer. When no local timestamp exists, trust cloud.
        if (!localWriteAt || remoteTime >= localTime) {
          app.data = remote.data;
          storage.save(storageKey, app.data);
          if (storage.markLocalWrite && remote.updatedAt) {
            storage.markLocalWrite(storageKey, remote.updatedAt);
          }
          window.TrackerUI.renderTasks(app);
          app.updateStats();
          window.TrackerCharts.update(app);
          setSyncStatus('loaded from cloud', false);
          return;
        }

        // Local snapshot is newer than cloud; push it.
        await pushWithRetry(storageKey, app.data, 3);
        return;
      }

      // If cloud has no row for this unit, seed only when local has real progress.
      if (countCompleted(app.data) > 0) {
        await pushWithRetry(storageKey, app.data, 3);
      } else {
        setSyncStatus('no cloud data yet for this unit', false);
      }
    }

    function bindCloudAuthSync(app) {
      if (!window.SupabaseClient || !window.SupabaseClient.isConfigured()) return;
      const client = window.SupabaseClient.getClient();
      if (!client || !client.auth) return;

      // Re-sync on auth restoration/sign-in events.
      client.auth.onAuthStateChange(function () {
        tryCloudPull(app);
      });

      // Session hydration can lag on first load in some browsers.
      setTimeout(function () {
        tryCloudPull(app);
      }, 600);

      setTimeout(function () {
        tryCloudPull(app);
      }, 1800);

      // Keep page updated if progress was changed from another device while this page is open.
      setInterval(function () {
        tryCloudPull(app);
      }, 15000);
    }

    function saveLocalState(data) {
      storage.save(storageKey, data);
      if (storage.markLocalWrite) {
        storage.markLocalWrite(storageKey);
      }
    }

    return {
      data: resolveInitialData(),
      filter: 'all',
      charts: {},

      init: function () {
        setSyncStatus('initializing...', false);
        window.TrackerUI.updateFilterButtons(this.filter);
        window.TrackerUI.renderTasks(this);
        this.charts = window.TrackerCharts.init(this);
        this.updateStats();
        bindCloudAuthSync(this);
        tryCloudPull(this);
      },

      save: function () {
        saveLocalState(this.data);
        if (window.TrackerCloud && window.TrackerCloud.push) {
          pushWithRetry(storageKey, this.data, 3);
        }
        this.updateStats();
        window.TrackerCharts.update(this);
      },

      toggleTask: function (topicIndex, taskIndex) {
        this.data[topicIndex].tasks[taskIndex].completed = !this.data[topicIndex].tasks[taskIndex].completed;
        this.save();
        window.TrackerUI.renderTasks(this);
      },

      setFilter: function (filterType) {
        this.filter = filterType;
        window.TrackerUI.updateFilterButtons(filterType);
        window.TrackerUI.renderTasks(this);
      },

      resetProgress: function () {
        if (confirm('Are you sure you want to reset all progress?')) {
          this.data = window.TrackerStorage.deepCopy(seedData);
          this.save();
          window.TrackerUI.renderTasks(this);
        }
      },

      getCounts: function () {
        let total = 0;
        let completed = 0;

        this.data.forEach(function (topic) {
          topic.tasks.forEach(function (task) {
            total += 1;
            if (task.completed) completed += 1;
          });
        });

        return {
          total: total,
          completed: completed,
          percent: total === 0 ? 0 : Math.round((completed / total) * 100)
        };
      },

      updateStats: function () {
        const stats = this.getCounts();
        window.TrackerUI.updateStats(stats.percent);
        if (window.TrackerUI.updateTypeProgress && window.TrackerCharts.getTypeCounts) {
          window.TrackerUI.updateTypeProgress(window.TrackerCharts.getTypeCounts(this.data));
        }
      }
    };
  }

  window.createStudyTrackerApp = createStudyTrackerApp;
})();
