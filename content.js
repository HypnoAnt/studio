// content.js

// Function to select text on the page (example)
function selectText() {
  const textNodes = document.evaluate(
    '//text()',
    document.body,
    null,
    XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
    null
  );

  let node = textNodes.iterateNext();
  let fullText = '';
  const textElements = [];

  while (node) {
    // You might want to filter out script and style tags
    if (node.parentElement.tagName !== 'SCRIPT' && node.parentElement.tagName !== 'STYLE') {
      fullText += node.textContent + ' ';
      textElements.push(node);
    }
    node = textNodes.iterateNext();
  }

  // TODO: Add code here to send 'fullText' to the background script for slang detection.
  console.log("Sending text for analysis:", fullText);
  // chrome.runtime.sendMessage({ action: "analyzeSlang", text: fullText });

  // Store text elements for later highlighting
  return textElements;
}

// Run the text selection function when the page loads
const pageTextElements = selectText();

// TODO: Add code here to receive results from the background script
// and highlight the identified slang terms on the page using 'pageTextElements'.
/*
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "slangDetected" && request.slangInfo) {
    // Iterate through 'pageTextElements' to find and highlight slang based on 'request.slangInfo'
    console.log("Slang detected:", request.slangInfo);
    // Example highlighting (basic):
    // pageTextElements.forEach(node => {
    //   if (node.textContent.includes(request.slangInfo.term)) {
    //     // Apply highlighting (e.g., wrap in a span with a class)
    //   }
    // });
  }
});
*/

// TODO: Add code here to handle user interactions with highlighted slang,
// such as showing a popup with the slang definition.
/*
document.body.addEventListener('click', (event) => {
  // Check if the clicked element is a highlighted slang term
  // If it is, open the popup and send the slang info to the popup script
  // chrome.runtime.sendMessage({ action: "displaySlangInfo", info: slangDetails });
});
*/