const mockChrome = require('sinon-chrome')

module.exports = () => {
  global.chrome = mockChrome

  return {
    createTab: (newTab) => {
      mockChrome.tabs.onCreated.dispatch(newTab)
    },

    changeTab: (newSelectedTab) => {
      mockChrome.tabs.onActivated.dispatch(newSelectedTab)
    },

    closeTab: (closedTab) => {
      const reformattedClosedTab = {
        tabId: closedTab.id,
      }
      mockChrome.tabs.onRemoved.dispatch(reformattedClosedTab)
    },
  }
}
