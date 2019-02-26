

module.exports = (tabTidyApi) => {
  let activeTabId

  const createTab = (tabId) => {
    const newTab = {
      tabId,
      createdTimestamp: new Date().toISOString(),
    }
    tabTidyApi.createTab(newTab)
  }

  chrome.tabs.onCreated.addListener((tab) => {
    activeTabId = tab.id

    createTab(activeTabId)
  })

  const updateTab = (tabId) => {
    const inactiveTab = {
      tabId,
      lastActiveTimestamp: new Date().toISOString(),
    }
    tabTidyApi.updateTab(inactiveTab)
  }

  chrome.tabs.onActivated.addListener((tab) => {
    if (activeTabId) {
      updateTab(activeTabId)

      activeTabId = tab.id
    }
  })

  const closeTab = (tabId) => {
    const closedTab = {
      tabId,
      closedTimestamp: new Date().toISOString(),
    }

    if (tabId === activeTabId) {
      closedTab.lastActiveTimestamp = new Date().toISOString()
    }

    tabTidyApi.updateTab(closedTab)
  }

  chrome.tabs.onRemoved.addListener((tab) => {
    closeTab(tab.tabId)

    if (tab.tabId === activeTabId) {
      activeTabId = undefined
    }
  })
}
