// Popup script
document.addEventListener("DOMContentLoaded", () => {
  const statusMessage = document.getElementById("status-message");

  // Send message to the content script to retrieve connections data
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (
      activeTab.url.startsWith(
        "https://www.linkedin.com/search/results/people/"
      )
    ) {
      chrome.tabs.sendMessage(
        activeTab.id,
        { action: "getConnections" },
        (response) => {
          if (response.success) {
            statusMessage.textContent = "Connections downloaded successfully!";
          }
        }
      );
    } else {
      statusMessage.textContent =
        "This extension only works on LinkedIn connections page.";
    }
  });
});
