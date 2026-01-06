// Main application entry point

// Global state
let allData = [];
let currentType = '';
let currentView = 'sources'; // 'sources', 'entries', or 'memorization'
let currentSource = '';
let currentEntry = null;
let currentLineIndex = 0;

// Initialize app
async function init() {
  allData = await loadData();
  console.log('Loaded data:', allData);
  
  if (allData.length > 0) {
    const types = getUniqueTypes(allData);
    createTabs(types);
    renderContent(types[0]);
  } else {
    document.getElementById('app').innerHTML = '<p>No data available</p>';
  }
}

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', init);
