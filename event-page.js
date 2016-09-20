// This event page fires every time there are changes in any browser tab
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    chrome.tabs.sendMessage(tabId, {tab: tab}, function(response) {})
  }
});
