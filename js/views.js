// View rendering functions

// Create tabs based on available types
function createTabs(types) {
  const tabsContainer = document.getElementById('tabs');
  tabsContainer.innerHTML = '';
  
  types.forEach((type, index) => {
    const tab = document.createElement('button');
    tab.className = 'tab';
    tab.textContent = type;
    tab.dataset.type = type;
    
    if (index === 0) {
      tab.classList.add('active');
      currentType = type;
    }
    
    tab.addEventListener('click', () => switchTab(type));
    tabsContainer.appendChild(tab);
  });
}

// Render content for selected type (sources view)
function renderContent(type) {
  const app = document.getElementById('app');
  const filteredData = allData.filter(item => item.type === type);
  const sources = getSourcesForType(type);
  const currentItem = getCurrentItem();
  
  let html = '';
  
  // Add Practice Current button if there's a current item
  if (currentItem && currentItem.type === type) {
    html += `
      <div class="practice-current-container">
        <button class="practice-current-button" id="practice-current">Practice Current: ${currentItem.location}</button>
      </div>
    `;
  }
  
  html += `
    <h2>${type.charAt(0).toUpperCase() + type.slice(1)} Collection</h2>
    <div class="cards-container">
  `;
  
  sources.forEach(({ source, count }) => {
    html += `
      <div class="source-card" data-source="${source}">
        <h3>${source}</h3>
        <p class="count">${count} ${count === 1 ? 'entry' : 'entries'}</p>
      </div>
    `;
  });
  
  html += `
    </div>
    <div class="random-button-container">
      <button class="random-button">Select Random ${type.charAt(0).toUpperCase() + type.slice(1)}</button>
    </div>
  `;
  
  app.innerHTML = html;
  
  // Add event listener for Practice Current button
  const practiceCurrentBtn = document.getElementById('practice-current');
  if (practiceCurrentBtn) {
    practiceCurrentBtn.addEventListener('click', practiceCurrent);
  }
  
  // Add event listeners
  document.querySelectorAll('.source-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.source-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectSource(card.dataset.source, type);
    });
  });
  
  document.querySelector('.random-button').addEventListener('click', () => {
    selectRandom(type);
  });
}

// Render entries view for a specific source
function renderEntriesView(source, type) {
  const app = document.getElementById('app');
  const entries = getEntriesForSource(source, type);
  const currentItem = getCurrentItem();
  
  let html = `
    <button class="back-button">Back to Sources</button>
  `;
  
  // Add Practice Current button if current item is in this source
  if (currentItem && currentItem.type === type && currentItem.source === source) {
    html += `
      <div class="practice-current-container">
        <button class="practice-current-button" id="practice-current">Practice Current: ${currentItem.location}</button>
      </div>
    `;
  }
  
  html += `
    <h2>${source}</h2>
    <p style="color: #666; margin-bottom: 2rem;">${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}</p>
    <div class="cards-container">
  `;
  
  entries.forEach((entry, index) => {
    const currentBadge = entry.current ? '<span class="current-badge">CURRENT</span>' : '';
    html += `
      <div class="entry-card" data-index="${index}">
        <div class="location">${entry.location}${currentBadge}</div>
        <div class="preview">${entry.preview}</div>
      </div>
    `;
  });
  
  html += `
    </div>
    <div class="random-button-container">
      <button class="random-button">Select Random from ${source}</button>
    </div>
  `;
  
  app.innerHTML = html;
  
  // Add event listeners
  document.querySelector('.back-button').addEventListener('click', () => {
    currentView = 'sources';
    renderContent(type);
  });
  
  const practiceCurrentBtn = document.getElementById('practice-current');
  if (practiceCurrentBtn) {
    practiceCurrentBtn.addEventListener('click', practiceCurrent);
  }
  
  document.querySelectorAll('.entry-card').forEach((card, index) => {
    card.addEventListener('click', () => {
      selectEntry(entries[index]);
    });
  });
  
  document.querySelector('.random-button').addEventListener('click', () => {
    // Select random from current source only
    if (entries.length > 0) {
      const random = entries[Math.floor(Math.random() * entries.length)];
      selectEntry(random);
    }
  });
}

// Render memorization view
function renderMemorizationView() {
  const app = document.getElementById('app');
  
  let html = `
    <div class="memorization-panel">
      <button class="back-button">Back to Entries</button>
      
      <div class="memorization-header">
        <h2>${currentEntry.location}</h2>
      </div>
      
      <div class="controls">
        <button class="control-button" id="show-next">Show Next Line</button>
        <button class="control-button secondary" id="reset">Start Over</button>
      </div>
      
      <div class="text-display" id="text-display">
        ${renderTextLines()}
      </div>
      
      <div class="metadata">
        <h3>Details</h3>
        <div class="metadata-row">
          <div class="metadata-label">Type:</div>
          <div class="metadata-value">${currentEntry.type}</div>
        </div>
        <div class="metadata-row">
          <div class="metadata-label">Source:</div>
          <div class="metadata-value">${currentEntry.source}</div>
        </div>
        <div class="metadata-row">
          <div class="metadata-label">Speaker:</div>
          <div class="metadata-value ${currentEntry.speaker ? '' : 'empty'}">${currentEntry.speaker || 'Not specified'}</div>
        </div>
        <div class="metadata-row">
          <div class="metadata-label">URL:</div>
          <div class="metadata-value ${currentEntry.url ? '' : 'empty'}">${currentEntry.url ? `<a href="${currentEntry.url}" target="_blank">${currentEntry.url}</a>` : 'Not specified'}</div>
        </div>
      </div>
    </div>
  `;
  
  app.innerHTML = html;
  
  // Add event listeners
  document.querySelector('.back-button').addEventListener('click', () => {
    currentView = 'entries';
    renderEntriesView(currentSource, currentType);
  });
  
  document.getElementById('show-next').addEventListener('click', () => {
    if (currentLineIndex < currentEntry.text.length - 1) {
      currentLineIndex++;
      updateTextDisplay();
    }
  });
  
  document.getElementById('reset').addEventListener('click', () => {
    currentLineIndex = -1;
    updateTextDisplay();
  });
  
  updateShowNextButton();
}

// Render visible text lines
function renderTextLines() {
  if (currentLineIndex < 0) {
    return '<div class="text-line" style="color: #999; font-style: italic;">Click "Show Next Line" to begin</div>';
  }
  
  let html = '';
  for (let i = 0; i <= currentLineIndex; i++) {
    html += `<div class="text-line">${currentEntry.text[i]}</div>`;
  }
  return html;
}

// Show modal for multiple current items
function showMultipleCurrentModal(items) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  
  let html = `
    <div class="modal">
      <h2>Multiple Items Marked as Current</h2>

      <ul class="modal-list">
  `;
  
  items.forEach((item, index) => {
    html += `
      <li class="modal-list-item" data-index="${index}">
        <div class="modal-list-item-location">${item.location}</div>
        <div class="modal-list-item-source">${item.source}</div>
      </li>
    `;
  });
  
  html += `
      </ul>
      <button class="modal-close">Close</button>
    </div>
  `;
  
  overlay.innerHTML = html;
  document.body.appendChild(overlay);
  
  // Add event listeners
  overlay.querySelector('.modal-close').addEventListener('click', () => {
    document.body.removeChild(overlay);
  });
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  });
  
  overlay.querySelectorAll('.modal-list-item').forEach((item, index) => {
    item.addEventListener('click', () => {
      document.body.removeChild(overlay);
      selectEntry(items[index]);
    });
  });
}
