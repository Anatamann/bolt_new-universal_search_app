const SEARCH_ENGINES = {
  'google': 'https://www.google.com/search?q=',
  'youtube': 'https://www.youtube.com/results?search_query=',
  'github': 'https://github.com/search?q=',
  'reddit': 'https://www.reddit.com/search/?q=',
};

// Listen for when the user types the keyword and presses Enter
chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  // text is the full string the user typed after the keyword
  // disposition is where the user wants to open the results (e.g., 'currentTab', 'newForegroundTab')

  // 1. Parse the user's input
  const [platform, ...queryParts] = text.trim().split(' ');
  const query = queryParts.join(' ');

  // 2. Determine the search engine URL
  let searchUrl = SEARCH_ENGINES['google']; // Default to Google
  if (platform && SEARCH_ENGINES[platform.toLowerCase()]) {
    searchUrl = SEARCH_ENGINES[platform.toLowerCase()];
  }

  // 3. If a platform was specified, use the rest as the query.
  //    Otherwise, the whole input is the query.
  const finalQuery = query ? query : text;

  const finalUrl = `${searchUrl}${encodeURIComponent(finalQuery)}`;

  // 4. Open a new tab with the search results
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
