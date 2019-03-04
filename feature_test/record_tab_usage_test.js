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

    mockChrome.createThenSelectNewTab(tab1)
    mockChrome.createThenSelectNewTab(tab2)
  })

  describe('When user opens a new tab', function () {
    it('should post new tab to api', async function () {
      const { tabId, createdTimestamp } = stubbedTabPost.firstCall.args[1].variables.CreateTabInput

      expect(tabId).equals(tab1.id)
      expect(isTimestamp(createdTimestamp)).to.be.true
    })
  })

  context('Given a tab is active', function () {
    it('should, when becomes inactive, update api with last active timestamp of that tab', async function () {
      mockChrome.changeTab(tab1)

      const { tabId, lastActiveTimestamp }
        = stubbedTabPost.getCall(5).args[1].variables.UpdateTabInput

      expect(tabId).equals(tab2.id)
      expect(lastActiveTimestamp).is.not.empty
    })

    it('should, if tab is closed, update api with last active and closed timestamps', async function () {
      mockChrome.closeTab(tab2)

      const { closedTimestamp, lastActiveTimestamp }
          = stubbedTabPost.getCall(5).args[1].variables.UpdateTabInput

      expect(lastActiveTimestamp).is.not.empty
      expect(closedTimestamp).is.not.empty
    })
  })

  context('Given tab is inactive,', function () {
    it('should, if becomes active, update api with inactive period start and end times', async function () {
      mockChrome.changeTab(tab1)

      const stuff = 1
      const { activeTimestamp, inactiveTimestamp, tabId }
          = stubbedTabPost.getCall(6).args[1].variables.CreateInactiveRecInput

      expect(tabId).equals(tab1.id)
      expect(isTimestamp(inactiveTimestamp)).to.be.true
      expect(isTimestamp(activeTimestamp)).to.be.true
    })

    it('should, if tab is closed, update api with JUST closed timestamp', async function () {
      mockChrome.closeTab(tab1)

      const { closedTimestamp, lastActiveTimestamp, tabId }
          = stubbedTabPost.getCall(5).args[1].variables.UpdateTabInput

      expect(tabId).equals(tab1.id)
      expect(closedTimestamp).is.not.empty
      expect(lastActiveTimestamp).is.undefined
    })
  })
})
