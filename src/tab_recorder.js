

module.exports = (tabTidyApi) => {
  chrome.tabs.onCreated.addListener((tab) => {
    const newTab = {
      tabId: tab.id,
      createdTimestamp: new Date().toUTCString(),
    };

    tabTidyApi.createTab(newTab);
  });
};
