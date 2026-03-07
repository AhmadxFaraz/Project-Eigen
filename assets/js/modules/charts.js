(function () {
  const centerTextPlugin = {
    id: 'centerText',
    afterDraw: function (chart) {
      const centerText = chart && chart.config && chart.config.options && chart.config.options.plugins && chart.config.options.plugins.centerText;
      if (!centerText || !centerText.display) return;

      const meta = chart.getDatasetMeta(0);
      if (!meta || !meta.data || !meta.data.length) return;

      const x = meta.data[0].x;
      const y = meta.data[0].y;
      const ctx = chart.ctx;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = centerText.color || '#e2e8f0';
      ctx.font = centerText.font || '700 30px Inter';
      ctx.fillText(centerText.text || '0%', x, y);
      ctx.restore();
    }
  };

  if (typeof Chart !== 'undefined' && Chart.register) {
    Chart.register(centerTextPlugin);
  }

  function safePercent(done, total) {
    if (!total) return 0;
    return Math.round((done / total) * 100);
  }

  function getTypeCounts(data) {
    const counts = {
      theoryTotal: 0,
      theoryDone: 0,
      problemTotal: 0,
      problemDone: 0
    };

    if (!Array.isArray(data)) return counts;

    data.forEach(function (topic) {
      if (!topic || !Array.isArray(topic.tasks)) return;
      topic.tasks.forEach(function (task) {
        if (!task) return;
        const isTheory = task.type === 'theory';
        if (isTheory) {
          counts.theoryTotal += 1;
          if (task.completed) counts.theoryDone += 1;
          return;
        }

        counts.problemTotal += 1;
        if (task.completed) counts.problemDone += 1;
      });
    });

    return counts;
  }

  function getSegmentLabel(context) {
    const label = context.label || '';
    const value = context.parsed || 0;
    const dataset = context.dataset || {};
    const data = dataset.data || [];
    const total = data.reduce(function (sum, v) { return sum + (v || 0); }, 0);
    const percent = safePercent(value, total);
    return `${label}: ${value} (${percent}%)`;
  }

  function init(app) {
    const charts = {};

    const progressCanvas = document.getElementById('progressChart');
    if (progressCanvas) {
      const ctxProgress = progressCanvas.getContext('2d');
      charts.progress = new Chart(ctxProgress, {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'Remaining'],
          datasets: [{
            data: [0, 100],
            backgroundColor: ['#34d399', '#334155'],
            borderWidth: 0,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '75%',
          plugins: {
            centerText: {
              display: true,
              text: '0%',
              color: window.ThemePalette.text,
              font: '700 30px Inter'
            },
            legend: { position: 'bottom', labels: { color: window.ThemePalette.textSoft } },
            tooltip: {
              callbacks: {
                label: getSegmentLabel
              }
            }
          }
        }
      });
    }

    const mixCanvas = document.getElementById('mixChart');
    if (mixCanvas) {
      const ctxMix = mixCanvas.getContext('2d');
      charts.mix = new Chart(ctxMix, {
        type: 'doughnut',
        data: {
          labels: ['Theory Done', 'Theory Remaining', 'Problem Done', 'Problem Remaining'],
          datasets: [{
            data: [0, 0, 0, 0],
            backgroundColor: ['#38bdf8', '#1e3a5f', '#f59e0b', '#5b3a13'],
            borderWidth: 0,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '75%',
          plugins: {
            centerText: {
              display: true,
              text: '0%',
              color: window.ThemePalette.text,
              font: '700 30px Inter'
            },
            legend: { position: 'bottom', labels: { color: window.ThemePalette.textSoft } },
            tooltip: {
              callbacks: {
                label: getSegmentLabel
              }
            }
          }
        }
      });
    }

    update(app, charts);
    return charts;
  }

  function update(app, charts) {
    const targetCharts = charts || app.charts;
    if (!targetCharts) return;

    const counts = app.getCounts();
    const typeCounts = getTypeCounts(app.data);

    if (targetCharts.progress) {
      targetCharts.progress.data.datasets[0].data = [counts.completed, counts.total - counts.completed];
      targetCharts.progress.options.plugins.centerText.text = `${counts.percent}%`;
      targetCharts.progress.update();
    }

    if (targetCharts.mix) {
      const mixData = [
        typeCounts.theoryDone,
        typeCounts.theoryTotal - typeCounts.theoryDone,
        typeCounts.problemDone,
        typeCounts.problemTotal - typeCounts.problemDone
      ];

      const done = typeCounts.theoryDone + typeCounts.problemDone;
      const total = typeCounts.theoryTotal + typeCounts.problemTotal;

      targetCharts.mix.data.datasets[0].data = mixData;
      targetCharts.mix.options.plugins.centerText.text = `${safePercent(done, total)}%`;
      targetCharts.mix.update();
    }
  }

  window.TrackerCharts = {
    init,
    update,
    getTypeCounts
  };
})();
