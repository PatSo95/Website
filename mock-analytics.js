window.__analyticsInitialized = true;
window.__analyticsEvents = window.__analyticsEvents || [];
window.__analyticsEvents.push({
  event: 'analytics_loaded',
  timestamp: new Date().toISOString(),
});

console.log('Mock analytics initialized after explicit consent.');
