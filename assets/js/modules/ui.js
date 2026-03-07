(function () {
  const ACTIVE_FILTER_CLASS = 'px-4 py-2 text-sm font-semibold rounded-md bg-white/20 text-white border border-white/35 shadow-[0_0_20px_rgba(255,255,255,0.14)] transition-all duration-300';
  const INACTIVE_FILTER_CLASS = 'px-4 py-2 text-sm font-medium rounded-md text-gray-300 border border-transparent hover:border-white/20 hover:bg-white/10 transition-all duration-300';

  const stripeMap = {
    blue: 'bg-cyan-300',
    indigo: 'bg-indigo-300',
    purple: 'bg-violet-300',
    teal: 'bg-teal-300',
    amber: 'bg-amber-300'
  };

  const badgeMap = {
    blue: 'bg-cyan-500/15 text-cyan-200 border border-cyan-400/25',
    indigo: 'bg-indigo-500/15 text-indigo-200 border border-indigo-400/25',
    purple: 'bg-violet-500/15 text-violet-200 border border-violet-400/25',
    teal: 'bg-teal-500/15 text-teal-200 border border-teal-400/25',
    amber: 'bg-amber-500/15 text-amber-200 border border-amber-400/25'
  };

  function safePercent(done, total) {
    if (!total) return 0;
    return Math.round((done / total) * 100);
  }

  function updateFilterButtons(filterType) {
    ['all', 'incomplete', 'completed'].forEach(function (type) {
      const btn = document.getElementById(`btn-${type}`);
      if (!btn) return;
      btn.className = type === filterType ? ACTIVE_FILTER_CLASS : INACTIVE_FILTER_CLASS;
    });
  }

  function updateStats(percent) {
    const motivator = document.getElementById('motivation-text');
    if (!motivator) return;

    if (percent === 0) motivator.textContent = '"Structure begins before progress does."';
    else if (percent < 20) motivator.textContent = '"Consistency matters more than intensity."';
    else if (percent < 40) motivator.textContent = '"Understanding is building, piece by piece."';
    else if (percent < 60) motivator.textContent = '"Momentum is now on your side."';
    else if (percent < 80) motivator.textContent = '"Precision now. No careless gaps."';
    else if (percent < 100) motivator.textContent = '"The finish line is in sight. Stay steady."';
    else motivator.textContent = '"Prepared with clarity. Earn the result."';
  }

  function updateTypeProgress(typeCounts) {
    const counts = typeCounts || {};
    const theoryDone = counts.theoryDone || 0;
    const theoryTotal = counts.theoryTotal || 0;
    const problemDone = counts.problemDone || 0;
    const problemTotal = counts.problemTotal || 0;

    const theoryText = document.getElementById('theory-progress-text');
    if (theoryText) {
      theoryText.textContent = `Theory: ${theoryDone}/${theoryTotal} (${safePercent(theoryDone, theoryTotal)}%)`;
    }

    const problemText = document.getElementById('problem-progress-text');
    if (problemText) {
      problemText.textContent = `Problems: ${problemDone}/${problemTotal} (${safePercent(problemDone, problemTotal)}%)`;
    }
  }

  function renderTasks(app) {
    const grid = document.getElementById('topic-grid');
    if (!grid) return;

    grid.innerHTML = '';

    app.data.forEach(function (topic, tIndex) {
      const filteredTasks = topic.tasks.filter(function (task) {
        if (app.filter === 'all') return true;
        if (app.filter === 'completed') return task.completed;
        if (app.filter === 'incomplete') return !task.completed;
        return true;
      });

      if (filteredTasks.length === 0 && app.filter !== 'all') return;

      const tTotal = topic.tasks.length;
      const tDone = topic.tasks.filter(function (t) { return t.completed; }).length;
      const tPercent = tTotal === 0 ? 0 : Math.round((tDone / tTotal) * 100);

      const card = document.createElement('div');
      card.className = 'animated-border glow rounded-xl overflow-hidden flex flex-col transition duration-300';

      const headerClass = stripeMap[topic.color] || 'bg-gray-500';
      const badgeClass = badgeMap[topic.color] || 'bg-gray-100 text-gray-800';

      card.innerHTML = `
        <div class="h-2 ${headerClass} w-full"></div>
        <div class="p-5 flex-grow">
          <div class="flex justify-between items-start mb-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}">Topic ${tIndex + 1}</span>
            <span class="text-xs font-bold text-gray-400">${tDone}/${tTotal}</span>
          </div>
          <h3 class="text-lg font-bold text-gray-800 mb-1 leading-tight">${topic.title}</h3>
          <p class="text-xs text-gray-500 mb-4 min-h-[2rem]">${topic.description}</p>
          <div class="w-full bg-white/10 rounded-full h-1.5 mb-4">
            <div class="${headerClass} h-1.5 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(255,255,255,0.26)]" style="width: ${tPercent}%"></div>
          </div>
          <div class="space-y-3">
            ${filteredTasks.map(function (task) {
              const originalIndex = topic.tasks.findIndex(function (t) { return t.id === task.id; });
              return `
                <label class="flex items-start space-x-3 cursor-pointer group">
                  <input type="checkbox" class="task-checkbox form-checkbox shrink-0 text-emerald-500 rounded border-gray-300 focus:ring-emerald-500 transition duration-150 ease-in-out mt-0.5" ${task.completed ? 'checked' : ''} onchange="app.toggleTask(${tIndex}, ${originalIndex})">
                  <div class="text-sm text-gray-700 select-none group-hover:text-gray-900 transition-colors ${task.completed ? 'line-through text-gray-400' : ''}">
                    ${task.type === 'theory' ? '<span class="font-bold text-xs uppercase tracking-wide text-gray-400 mr-1">Theory</span>' : ''}
                    ${task.text}
                  </div>
                </label>
              `;
            }).join('')}
          </div>
        </div>
      `;

      grid.appendChild(card);
    });

    if (grid.innerHTML === '') {
      grid.innerHTML = '<div class="col-span-full text-center py-10 text-gray-400 italic">No tasks found for this filter.</div>';
    }
  }

  window.TrackerUI = {
    renderTasks,
    updateFilterButtons,
    updateStats,
    updateTypeProgress
  };
})();
