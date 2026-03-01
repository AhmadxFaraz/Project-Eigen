(function () {
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
            legend: { position: 'bottom', labels: { color: window.ThemePalette.textSoft } }
          }
        }
      });
    }

    const topicCanvas = document.getElementById('topicChart');
    if (topicCanvas) {
      const ctxTopic = topicCanvas.getContext('2d');
      charts.topic = new Chart(ctxTopic, {
        type: 'bar',
        data: {
          labels: app.data.map((t) => `Topic ${t.id.split('_')[1]}`),
          datasets: [
            {
              label: 'Completed',
              data: [],
              backgroundColor: '#38bdf8',
              borderRadius: 4
            },
            {
              label: 'Total Tasks',
              data: [],
              backgroundColor: '#475569',
              borderRadius: 4,
              grouped: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: window.ThemePalette.grid },
              ticks: { color: window.ThemePalette.textSoft, stepSize: 1, precision: 0 }
            },
            x: {
              grid: { display: false },
              ticks: { color: window.ThemePalette.textMuted }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                title: function (context) {
                  const index = context[0].dataIndex;
                  return app.data[index].title;
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

    if (targetCharts.progress) {
      targetCharts.progress.data.datasets[0].data = [counts.completed, counts.total - counts.completed];
      targetCharts.progress.update();
    }

    if (targetCharts.topic) {
      const topicCompleted = app.data.map((topic) => topic.tasks.filter((t) => t.completed).length);
      const topicTotal = app.data.map((topic) => topic.tasks.length);

      targetCharts.topic.data.datasets[0].data = topicCompleted;
      targetCharts.topic.data.datasets[1].data = topicTotal;
      targetCharts.topic.update();
    }
  }

  window.TrackerCharts = {
    init,
    update
  };
})();
