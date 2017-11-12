// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.action === "activeTabDOMContent") {
        sendResponse({domContent: document.documentElement.outerHTML});
    }
});