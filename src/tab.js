module.exports = (tabTidyApi) => {
  const tabs = []
  
  const Tab = class Tab {
    constructor({ tabId }) {
      const currentDateTime = new Date().toISOString()
      this.tabId = tabId
      this.createdTimestamp = currentDateTime
      this.lastActiveTimestamp = currentDateTime

      tabTidyApi.createTab({
        createdTimestamp: this.createdTimestamp,
        tabId: this.tabId,
      })
    }

    static createTab({ tabId }) {
      tabs.push(new this({ tabId }))
    }

    static currentActiveTab() {
      return tabs.find(tab => tab.isActive === true)
    }

    static getTab(id) {
      return tabs.find(tab => tab.tabId === id)
    }

    static changeActiveTab({ newActiveTabId }) {
      try {
        Tab.currentActiveTab().setInactive()
      } catch(error) {
        console.log(error)
      } 

      Tab.getTab(newActiveTabId).setActive()
    }

    setInactive() {
      this.isActive = false
      this.lastActiveTimestamp = new Date().toISOString()

      tabTidyApi.updateTab({
        tabId: this.tabId,
        lastActiveTimestamp: this.lastActiveTimestamp,
      })
    }

    setActive() {
      this.isActive = true

      tabTidyApi.createInactiveRec({
        tabId: this.tabId,
        inactiveTimestamp: this.lastActiveTimestamp,
        activeTimestamp: new Date().toISOString(),
      })
    }

    close() {
      const closedTab = {
        tabId: this.tabId,
        closedTimestamp: new Date().toISOString(),
      }

      if (this.isActive === true) {
        closedTab.lastActiveTimestamp = new Date().toISOString()
      }

      tabTidyApi.updateTab(closedTab)
    }
  }

  chrome.tabs.onCreated.addListener((tab) => {
    Tab.createTab({ tabId: tab.id })
  })

  chrome.tabs.onActivated.addListener((tab) => {
    Tab.changeActiveTab({ newActiveTabId: tab.id })
  })

  chrome.tabs.onRemoved.addListener((tab) => {
    Tab.getTab(tab.tabId).close()
  })
}
