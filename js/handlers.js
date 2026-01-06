// Event handlers and user interactions

// Switch active tab
function switchTab(type) {
  // Update active tab
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.type === type);
  });
  
  currentType = type;
  currentView = 'sources';
  renderContent(type);
}

// Handle source card selection
function selectSource(source, type) {
  currentSource = source;
  currentView = 'entries';
  renderEntriesView(source, type);
}

// Handle entry selection
function selectEntry(entry) {
  currentEntry = entry;
  currentLineIndex = -1;
  currentView = 'memorization';
  renderMemorizationView();
}

// Handle random selection
function selectRandom(type) {
  const filtered = allData.filter(item => item.type === type);
  if (filtered.length > 0) {
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    selectEntry(random);
  }
}

// Handle practice current
function practiceCurrent() {
  const currentItems = allData.filter(item => item.current === true);
  
  if (currentItems.length > 1) {
    // Show modal to select which one
    showMultipleCurrentModal(currentItems);
  } else if (currentItems.length === 1) {
    // Practice the single current item
    selectEntry(currentItems[0]);
  }
  // If no current items, do nothing
}

// Update text display
function updateTextDisplay() {
  const display = document.getElementById('text-display');
  display.innerHTML = renderTextLines();
  updateShowNextButton();
}

// Update show next button state
function updateShowNextButton() {
  const button = document.getElementById('show-next');
  if (currentLineIndex >= currentEntry.text.length - 1) {
    button.disabled = true;
    button.textContent = 'All Lines Shown';
  } else {
    button.disabled = false;
    button.textContent = 'Show Next Line';
  }
}
