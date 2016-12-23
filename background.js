chrome.tabs.onUpdated.addListener(function (tabId, change, tab) {
  if (change.url && change.url.match(/github.com\/\S*?\/\S*?/)) {
    chrome.pageAction.show(tabId);
  }
})
