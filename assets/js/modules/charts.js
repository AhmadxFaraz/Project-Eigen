(function () {
  const TOPIC_PALETTE = {
    blue: { vibrant: '#22d3ee', pastel: '#164e63' },
    indigo: { vibrant: '#818cf8', pastel: '#312e81' },
    purple: { vibrant: '#c084fc', pastel: '#581c87' },
    teal: { vibrant: '#2dd4bf', pastel: '#134e4a' },
    amber: { vibrant: '#fbbf24', pastel: '#78350f' },
    fallback: { vibrant: '#94a3b8', pastel: '#334155' }
  };

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

  function getTopicPalette(colorKey) {
    return TOPIC_PALETTE[colorKey] || TOPIC_PALETTE.fallback;
  }

  function getTopicStats(data) {
    if (!Array.isArray(data)) return [];

    return data.map(function (topic, index) {
      const tasks = topic && Array.isArray(topic.tasks) ? topic.tasks : [];
      const total = tasks.length;
      const done = tasks.filter(function (task) { return task && task.completed; }).length;
      const remaining = total - done;
      const palette = getTopicPalette(topic && topic.color);

      return {
        topicIndex: index,
        title: topic && topic.title ? topic.title : `Topic ${index + 1}`,
        shortLabel: `Topic ${index + 1}`,
        total: total,
        done: done,
        remaining: remaining,
        percent: safePercent(done, total),
        vibrant: palette.vibrant,
        pastel: palette.pastel
      };
    });
  }

  function buildTopicDataset(topicStats) {
    const labels = [];
    const data = [];
    const colors = [];
    const segmentMeta = [];

    topicStats.forEach(function (topic) {
      labels.push(`${topic.shortLabel} Done`);
      data.push(topic.done);
      colors.push(topic.vibrant);
      segmentMeta.push({ topicIndex: topic.topicIndex, state: 'Done' });

      labels.push(`${topic.shortLabel} Remaining`);
      data.push(topic.remaining);
      colors.push(topic.pastel);
      segmentMeta.push({ topicIndex: topic.topicIndex, state: 'Remaining' });
    });

    return { labels, data, colors, segmentMeta };
  }

  function getTooltipTopic(chart, dataIndex) {
    const meta = chart.$segmentMeta && chart.$segmentMeta[dataIndex];
    if (!meta) return null;
    const stats = chart.$topicStats && chart.$topicStats[meta.topicIndex];
    if (!stats) return null;
    return {
      stats: stats,
      state: meta.state
    };
  }

  function init(app) {
    const charts = {};

    const progressCanvas = document.getElementById('progressChart');
    if (progressCanvas) {
      const ctxProgress = progressCanvas.getContext('2d');
      charts.progress = new Chart(ctxProgress, {
        type: 'doughnut',
        data: {
          labels: [],
          datasets: [{
            data: [],
            backgroundColor: [],
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
            legend: { display: false },
            tooltip: {
              callbacks: {
                title: function (context) {
                  if (!context || !context.length) return '';
                  const chart = context[0].chart;
                  const topicInfo = getTooltipTopic(chart, context[0].dataIndex);
                  return topicInfo ? topicInfo.stats.title : '';
                },
                label: function (context) {
                  const chart = context.chart;
                  const topicInfo = getTooltipTopic(chart, context.dataIndex);
                  if (!topicInfo) return '';
                  const value = context.parsed || 0;
                  const topicPercent = safePercent(value, topicInfo.stats.total);
                  return `${topicInfo.state}: ${value} (${topicPercent}%)`;
                },
                footer: function (context) {
                  if (!context || !context.length) return '';
                  const chart = context[0].chart;
                  const topicInfo = getTooltipTopic(chart, context[0].dataIndex);
                  if (!topicInfo) return '';
                  const stats = topicInfo.stats;
                  return `Topic progress: ${stats.done}/${stats.total} (${stats.percent}%)`;
                }
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
    const topicStats = getTopicStats(app.data);
    const dataset = buildTopicDataset(topicStats);

    if (targetCharts.progress) {
      targetCharts.progress.data.labels = dataset.labels;
      targetCharts.progress.data.datasets[0].data = dataset.data;
      targetCharts.progress.data.datasets[0].backgroundColor = dataset.colors;
      targetCharts.progress.options.plugins.centerText.text = `${counts.percent}%`;
      targetCharts.progress.$topicStats = topicStats;
      targetCharts.progress.$segmentMeta = dataset.segmentMeta;
      targetCharts.progress.update();
    }
  }

  window.TrackerCharts = {
    init,
    update,
    getTopicStats
  };
})();
