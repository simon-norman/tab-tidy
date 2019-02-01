

module.exports = (tabTidyApi) => {
  let activeTabId;

  chrome.tabs.onCreated.addListener((tab) => {
    activeTabId = tab.id;

    const newTab = {
      tabId: tab.id,
      createdTimestamp: new Date().toISOString(),
    };

    tabTidyApi.createTab(newTab);
  });

  chrome.tabs.onActivated.addListener((tab) => {
    const inactiveTab = {
      tabId: activeTabId,
      lastActiveTimestamp: new Date().toISOString(),
    };

    tabTidyApi.updateTab(inactiveTab);

    activeTabId = tab.tabId;
  });

  chrome.tabs.onRemoved.addListener((tab) => {
    const closedTab = {
      tabId: tab.tabId,
      closedTimestamp: new Date().toISOString(),
    };

    if (tab.tabId === activeTabId) {
      closedTab.lastActiveTimestamp = new Date().toISOString();
    }

    tabTidyApi.updateTab(closedTab);

    activeTabId = undefined;
  });
};
