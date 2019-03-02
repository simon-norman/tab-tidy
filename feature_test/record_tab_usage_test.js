const chai = require('chai')
const sinonChai = require('sinon-chai')
const sinon = require('sinon')
const createMockChrome = require('./chrome_mock')
const isTimestamp = require('./is_timestamp_helper')
const createTabRecording = require('./test_app_factory')

chai.use(sinonChai)
const { expect } = chai

describe('Record tab usage', function () {
  let stubbedTabPost
  let tab1
  let tab2
  let mockChrome

  before(() => {
    mockChrome = createMockChrome()
  })

  beforeEach(() => {
    ({ stubbedTabPost } = createTabRecording())

    tab1 = { id: 'tab_1' }
    tab2 = { id: 'tab_2' }

    mockChrome.createTab(tab1)
  })

  describe('When user opens a new tab', function () {
    it('should post new tab to api', async function () {
      const { tabId, createdTimestamp } = stubbedTabPost.firstCall.args[1].variables.CreateTabInput

      expect(tabId).equals(tab1.id)
      expect(isTimestamp(createdTimestamp)).to.be.true
    })
  })

  context('Given a tab is active', function () {
    context('And that the tab ID has been stored in the tab recorder', function () {
      it('should, when becomes inactive, update api with last active timestamp of that tab', async function () {
        mockChrome.changeTab(tab2)

        const { tabId, lastActiveTimestamp }
          = stubbedTabPost.secondCall.args[1].variables.UpdateTabInput

        expect(tabId).equals(tab1.id)
        expect(lastActiveTimestamp).is.not.empty
      })
    })

    context('And that the tab ID has NOT been stored in the tab recorder', function () {
      it('should NOT, if becomes inactive, update api', async function () {
        mockChrome.changeTab({ id: undefined })
        mockChrome.changeTab(tab2)

        expect(stubbedTabPost.callCount).equals(2)
      })
    })

    it('should, if tab is closed, update api with last active and closed timestamps', async function () {
      mockChrome.closeTab(tab1)

      const { closedTimestamp, lastActiveTimestamp }
          = stubbedTabPost.secondCall.args[1].variables.UpdateTabInput

      expect(lastActiveTimestamp).is.not.empty
      expect(closedTimestamp).is.not.empty
    })
  })

  context('Given tab is inactive,', function () {
    it('should, if becomes active, update api with inactive period start and end times', async function () {
      mockChrome.changeTab(tab2)
      mockChrome.changeTab(tab1)

      const { activeTimestamp, inactiveTimestamp, tabId }
          = stubbedTabPost.thirdCall.args[1].variables.CreateInactiveRecInput

      expect(tabId).equals(tab1.id)
      expect(activeTimestamp).is.not.empty
      expect(inactiveTimestamp).is.undefined
    })

    it('should, if tab is closed, update api with JUST closed timestamp', async function () {
      mockChrome.closeTab(tab2)

      const { closedTimestamp, lastActiveTimestamp, tabId }
          = stubbedTabPost.secondCall.args[1].variables.UpdateTabInput

      expect(tabId).equals(tab2.id)
      expect(closedTimestamp).is.not.empty
      expect(lastActiveTimestamp).is.undefined
    })
  })
})
