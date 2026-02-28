(function () {
  function createStudyTrackerApp(config) {
    const storageKey = config.storageKey;
    const seedData = config.studyData;

    async function tryCloudPull(app) {
      if (!window.TrackerCloud || !window.TrackerCloud.pull) return;
      const remote = await window.TrackerCloud.pull(storageKey);
      if (!remote) return;

      app.data = remote;
      window.TrackerStorage.save(storageKey, app.data);
      window.TrackerUI.renderTasks(app);
      app.updateStats();
      window.TrackerCharts.update(app);
    }

    return {
      data: window.TrackerStorage.load(storageKey, seedData),
      filter: 'all',
      charts: {},

      init: function () {
        window.TrackerUI.updateFilterButtons(this.filter);
        window.TrackerUI.renderTasks(this);
        this.charts = window.TrackerCharts.init(this);
        this.updateStats();
        tryCloudPull(this);
      },

      save: function () {
        window.TrackerStorage.save(storageKey, this.data);
        if (window.TrackerCloud && window.TrackerCloud.push) {
          window.TrackerCloud.push(storageKey, this.data);
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
      }
    };
  }

  window.createStudyTrackerApp = createStudyTrackerApp;
})();
