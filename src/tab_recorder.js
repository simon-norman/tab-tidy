

module.exports = (tabTidyApi) => {
  let activeTabId;

  chrome.tabs.onCreated.addListener((tab) => {
    activeTabId = tab.id;

    const newTab = {
      tabId: tab.id,
      createdTimestamp: new Date().toUTCString(),
    };

    tabTidyApi.createTab(newTab);
  });

  chrome.tabs.onActivated.addListener((tab) => {
    const inactiveTab = {
      tabId: activeTabId,
      lastActiveTimestamp: new Date().toUTCString(),
    };

    tabTidyApi.updateTab(inactiveTab);

    activeTabId = tab.id;
  });

  chrome.tabs.onRemoved.addListener((tab) => {
    const closedTab = {
      tabId: tab.id,
      closedTimestamp: new Date().toUTCString(),
    };

    if (tab.id === activeTabId) {
      closedTab.lastActiveTimestamp = new Date().toUTCString();
    }

    tabTidyApi.updateTab(closedTab);

    activeTabId = undefined;
  });
};
