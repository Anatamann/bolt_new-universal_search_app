const form = document.getElementById('add-engine-form');
const nameInput = document.getElementById('name');
const urlInput = document.getElementById('url');
const enginesList = document.getElementById('engines-list');
const originalNameInput = document.getElementById('original-name');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');

const DEFAULT_ENGINES = {
  'google': 'https://www.google.com/search?q=%s',
  'youtube': 'https://www.youtube.com/results?search_query=%s',
  'github': 'https://github.com/search?q=%s',
  'reddit': 'https://www.reddit.com/search/?q=%s',
  'x' : 'https://twitter.com/search?q=%s',
  'wiki' : 'https://en.wikipedia.org/w/index.php?search=%s',
  'stackover' : 'https://stackoverflow.com/search?q=%s',
  'linkedin' : 'https://www.linkedin.com/search/results/all/?keywords=%s',
  'quora' : 'https://www.quora.com/search?q=%s' ,
  'gpt' : 'https://chatgpt.com/?q=%s'
};

// Load default engines and display them
const loadDefaultEngines = () => {
    const defaultEnginesList = document.getElementById('default-engines-list');
    defaultEnginesList.innerHTML = '';
    for (const name in DEFAULT_ENGINES) {
        const li = document.createElement('li');
        li.innerHTML = `<span><strong>${name}</strong>: ${DEFAULT_ENGINES[name]}</span>`;
        defaultEnginesList.appendChild(li);
    }
};

// Load existing engines and display them
const loadEngines = () => {
  chrome.storage.sync.get('customEngines', (data) => {
    const engines = data.customEngines || {};
    enginesList.innerHTML = '';
    for (const name in engines) {
      const li = document.createElement('li');
      li.innerHTML = `<span><strong>${name}</strong>: ${engines[name]}</span> 
                      <div>
                        <button class="edit-btn" data-name="${name}" data-url="${engines[name]}">Edit</button>
                        <button class="delete-btn" data-name="${name}">Delete</button>
                      </div>`;
      enginesList.appendChild(li);
    }
  });
};

// Reset the form to its default state (for adding)
const resetForm = () => {
    form.reset();
    originalNameInput.value = '';
    submitBtn.textContent = 'Add Engine';
    cancelBtn.style.display = 'none';
};

// Handle form submission (for both add and edit)
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const newName = nameInput.value.trim();
  const newUrl = urlInput.value.trim();
  const originalName = originalNameInput.value;

  if (newName && newUrl) {
    chrome.storage.sync.get('customEngines', (data) => {
      const engines = data.customEngines || {};
      // If we are editing and the name has changed, remove the old entry
      if (originalName && originalName !== newName) {
        delete engines[originalName];
      }
      engines[newName] = newUrl;
      chrome.storage.sync.set({ customEngines: engines }, () => {
        resetForm();
        loadEngines();
      });
    });
  }
});

// Handle clicks on the list (for edit and delete)
enginesList.addEventListener('click', (e) => {
  const target = e.target;

  // Handle Edit
  if (target.classList.contains('edit-btn')) {
    const name = target.dataset.name;
    const url = target.dataset.url;

    nameInput.value = name;
    urlInput.value = url;
    originalNameInput.value = name; // Keep track of the original name
    submitBtn.textContent = 'Update Engine';
    cancelBtn.style.display = 'inline-block';
    nameInput.focus();
  }

  // Handle Delete
  if (target.classList.contains('delete-btn')) {
    const name = target.dataset.name;
    chrome.storage.sync.get('customEngines', (data) => {
      const engines = data.customEngines || {};
      delete engines[name];
      chrome.storage.sync.set({ customEngines: engines }, loadEngines);
    });
  }
});

// Handle cancel button click
cancelBtn.addEventListener('click', resetForm);

// Initial load
loadDefaultEngines();
loadEngines();
