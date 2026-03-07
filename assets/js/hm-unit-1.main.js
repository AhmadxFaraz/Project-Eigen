const app = window.createStudyTrackerApp({
  studyData,
  storageKey: 'hm2612_unit1_data',
  fallbackStorageKeys: ['hm2612_data']
});

window.app = app;

document.addEventListener('DOMContentLoaded', function () {
  app.init();
});
