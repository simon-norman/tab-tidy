const mockChrome = require('sinon-chrome')

module.exports = () => {
  global.chrome = mockChrome
  mockChrome.tabs.query.yields()

  return {
    createTab(newTab) {
      mockChrome.tabs.onCreated.dispatch(newTab)
    },

    createThenActivateNewTab(newTab) {
      this.createTab(newTab)
      this.changeTab(newTab)
    },

    changeTab(newSelectedTab) {
      this.setTabReturnedByQuery(newSelectedTab)
      mockChrome.tabs.onActivated.dispatch(newSelectedTab)
    },

    closeTab(closedTab) {
      const reformattedClosedTab = {
        tabId: closedTab.id,
      }
      mockChrome.tabs.onRemoved.dispatch(reformattedClosedTab)
    },

    setTabReturnedByQuery(tab) {
      mockChrome.tabs.query.yields([tab])
    },
  }
}
