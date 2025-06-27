// background.js

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // Listen for messages from content scripts

    if (request.action === "analyzeText") {
      const textToAnalyze = request.text;

      // TODO: Add code here to call the Gemini API with textToAnalyze
      // Example:
      // const slangInfo = await callGeminiApi(textToAnalyze);

      // TODO: Send the results (slang information) back to the content script
      // Example:
      // sendResponse({ slangInfo: slangInfo });
      console.log("Received text for analysis:", textToAnalyze);

      // IMPORTANT: If you use sendResponse asynchronously, make sure to return true from the event handler
      // to indicate that you wish to send a response later.
      // For a synchronous response, remove the return true and call sendResponse directly.
      // For now, we'll simulate an asynchronous response with a placeholder.
      // setTimeout(() => {
      //   sendResponse({ result: "Analysis complete (placeholder)" });
      // }, 1000);
      // return true;
    }

    // If you don't need to send a response, or are sending it synchronously,
    // you don't need to return true.
  }
);

// TODO: Add any other background tasks or listeners here
// For example, managing settings, handling browser action clicks (if not using a popup), etc.