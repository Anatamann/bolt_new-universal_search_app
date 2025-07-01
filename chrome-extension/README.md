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
