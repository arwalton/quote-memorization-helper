// Data management functions

// Load data from db.json
async function loadData() {
  try {
    const response = await fetch('db.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading data:', error);
    return [];
  }
}

// Get unique types from data
function getUniqueTypes(data) {
  const types = [...new Set(data.map(item => item.type))];
  return types.sort();
}

// Get unique sources for a given type
function getSourcesForType(type) {
  const filtered = allData.filter(item => item.type === type);
  const sourcesMap = new Map();
  
  filtered.forEach(item => {
    const source = item.source;
    if (sourcesMap.has(source)) {
      sourcesMap.set(source, sourcesMap.get(source) + 1);
    } else {
      sourcesMap.set(source, 1);
    }
  });
  
  return Array.from(sourcesMap.entries()).map(([source, count]) => ({
    source,
    count
  }));
}

// Get entries for a specific source and type
function getEntriesForSource(source, type) {
  return allData.filter(item => item.type === type && item.source === source);
}

// Get the current item
function getCurrentItem() {
  return allData.find(item => item.current === true);
}
