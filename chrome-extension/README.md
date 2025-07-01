#  Universal Search - Chrome Extension

This Chrome extension provides a powerful, unified search experience directly from your browser's address bar (Omnibox). It allows you to quickly direct searches to different platforms like Google, YouTube, GitHub, and Reddit without navigating to them first.

## 🚀 Workflow

The extension works by registering a special keyword with Chrome. When you activate this keyword in the address bar, the extension takes over and listens for your input.

1.  **Activation**: The user types the keyword `ek` into the address bar and presses the `Tab` or `Space` key.
2.  **Input**: The address bar now shows a "Universal Search" prompt. The extension's background service worker starts listening for what the user types. It will also provide suggestions for different search platforms.
3.  **Execution**: When the user presses `Enter`, the extension parses the input to identify the target platform and the search query.
4.  **Redirection**: The extension constructs the correct search URL and opens the results in a new browser tab.

If no platform is specified, the search defaults to Google.

## 🛠️ How to Install

Since this is an unpacked extension, you need to load it manually in developer mode.

1.  Open Google Chrome and navigate to `chrome://extensions`.
2.  Enable **Developer mode** using the toggle switch in the top-right corner.
3.  Click the **Load unpacked** button that appears on the top-left.
4.  In the file selection dialog, navigate to and select the `chrome-extension` directory.

The "Universal Search" extension will now be installed and active.

## ⚙️ Managing Custom Search Engines

This extension allows you to add, edit, and delete your own custom search engines via the options page.

### How to Open the Options Page

1.  Right-click on the Universal Search extension icon in your Chrome toolbar.
2.  Select **Options** from the context menu.

### Adding a Custom Engine

1.  On the options page, you will see a form titled **"Add/Edit Search Engine"**.
2.  **Name (Keyword)**: Enter the keyword you want to use for this engine (e.g., `ddg`, `wiki`).
3.  **Search URL**: Enter the full search URL for the website. **Crucially, use `%s` as a placeholder for where the search query should go.**
    *   *Example for DuckDuckGo*: `https://duckduckgo.com/?q=%s`
    *   *Example for Wikipedia*: `https://en.wikipedia.org/w/index.php?search=%s`
4.  Click the **Add Engine** button. Your new engine will appear in the "Custom Search Engines" list.

### Editing an Engine

1.  In the "Custom Search Engines" list, find the engine you want to modify.
2.  Click the **Edit** button next to it.
3.  The form will be populated with the engine's current details.
4.  Make your changes and click the **Update Engine** button.

### Deleting an Engine

1.  In the list, find the engine you want to remove.
2.  Click the **Delete** button next to it. The engine will be removed immediately.

## 📖 How to Use

To use the extension, follow these steps:

1.  Click on the Chrome address bar.
2.  Type the keyword `ek` and press `Tab` or `Space`.
3.  The address bar will now be in "Universal Search" mode.
4.  Type your search query. You can optionally specify a platform first.

### Search Examples:

*   **Default Search (Google)**:
    ```
    how to make a chrome extension
    ```
*   **Platform-Specific Search**:
    ```
    youtube react tutorial for beginners
    ```
*   **GitHub Repository Search**:
    ```
    github universal-search-app
    ```
*   **Reddit Search**:
    ```
    reddit best open source software
    ```

### Supported Platforms:

*   `google` (Default)
*   `youtube`
*   `github`
*   `reddit`

## 📂 File Structure

*   `manifest.json`: The core configuration file that defines the extension's properties, permissions, and the Omnibox keyword (`ek`).
*   `background.js`: The service worker that contains all the logic for handling Omnibox input and opening search results.
*   `images/icon.svg`: The SVG icon used for the extension in the toolbar and extensions menu.
*   `README.md`: This file.
