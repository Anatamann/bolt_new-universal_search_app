let SEARCH_ENGINES = {
  'google': 'https://www.google.com/search?q=%s',
  'youtube': 'https://www.youtube.com/results?search_query=%s',
  'github': 'https://github.com/search?q=%s',
  'reddit': 'https://www.reddit.com/search/?q=%s',
  'x' : 'https://twitter.com/search?q=%s',
  'wiki' : 'https://en.wikipedia.org/w/index.php?search=%s',
  'stacko' : 'https://stackoverflow.com/search?q=%s',
  'lkdin' : 'https://www.linkedin.com/search/results/all/?keywords=%s',
  'quora' : 'https://www.quora.com/search?q=%s' ,
  'gpt' : 'https://chatgpt.com/?q=%s'
};

// Load custom engines from storage and merge them with the defaults
chrome.storage.sync.get('customEngines', (data) => {
  if (data.customEngines) {
    SEARCH_ENGINES = { ...SEARCH_ENGINES, ...data.customEngines };
  }
});

// Listen for changes in storage and update the engines list
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.customEngines) {
    chrome.storage.sync.get('customEngines', (data) => {
        SEARCH_ENGINES = {
            ...SEARCH_ENGINES,
            ...data.customEngines
        };
    });
  }
});

// Listen for when the user types the keyword and presses Enter
chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  const [platform, ...queryParts] = text.trim().split(' ');
  const query = queryParts.join(' ');

  let searchUrl = SEARCH_ENGINES['google']; // Default to Google
  if (platform && SEARCH_ENGINES[platform.toLowerCase()]) {
    searchUrl = SEARCH_ENGINES[platform.toLowerCase()];
  }

  const finalQuery = query ? query : text;
  const finalUrl = searchUrl.replace('%s', encodeURIComponent(finalQuery));

  chrome.tabs.create({ url: finalUrl });
});

// Optional: Provide suggestions as the user types
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  const suggestions = [];
  for (const key in SEARCH_ENGINES) {
    suggestions.push({ 
      content: `${key} ${text}`,
      description: `Search ${key} for <match>${text}</match>`
    });
  }
  suggest(suggestions);
});
