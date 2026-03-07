const app = window.createStudyTrackerApp({
  studyData,
  storageKey: 'hm2520_unit3_data',
  fallbackStorageKeys: ['hm2520_data']
});

window.app = app;

document.addEventListener('DOMContentLoaded', function () {
  app.init();
});
