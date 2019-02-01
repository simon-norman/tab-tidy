const chai = require('chai');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const createBaseApi = require('../src/base_api');
const mockChrome = require('sinon-chrome');
const createTabTidyApi = require('../src/tab_tidy_api');
const createTabRecorder = require('../src/tab_recorder');

chai.use(sinonChai);
const { expect } = chai;

describe('Record tab usage', function () {
  let stubbedTabPostCalls;
  let mockTab1;
  let mockTab2;

  const setUpTabRecording = () => {
    const baseApi = createBaseApi({
      baseURL: 'fake_tab_api.com',
    });

    stubbedTabPostCalls = sinon.stub(baseApi, 'post');
    stubbedTabPostCalls.returns(Promise.resolve(200));

    const tabTidyApi = createTabTidyApi({ baseApi });

    createTabRecorder(tabTidyApi);
  };

  before(() => {
    global.chrome = mockChrome;
  });

  beforeEach(() => {
    setUpTabRecording();

    mockTab1 = { id: 'mock_tab_1' };
    mockTab2 = { id: 'mock_tab_2' };

    sinon.resetHistory();
  });

  context('When user opens a new tab', function () {
    it('should post new tab to api', async function () {
      mockChrome.tabs.onCreated.dispatch(mockTab1);

      const newTabPost = stubbedTabPostCalls.firstCall.args[1].variables.input;
      expect(newTabPost.tabId).equals(mockTab1.id);
      expect(newTabPost.createdTimestamp).is.not.empty;
    });
  });

  context('When a tab becomes inactive (because user has clicked on different tab)', function () {
    it('should update api with last active timestamp of that tab', async function () {
      mockChrome.tabs.onCreated.dispatch(mockTab1);

      expect(stubbedTabPostCalls.secondCall).to.be.null;

      mockChrome.tabs.onActivated.dispatch(mockTab2);

      const updateTabPost = stubbedTabPostCalls.secondCall.args[1].variables.input;
      expect(updateTabPost.tabId).equals(mockTab1.id);
      expect(updateTabPost.lastActiveTimestamp).is.not.empty;
    });
  });

  context('When tab is closed,', function () {
    it('should update api with closed timestamp', async function () {
      mockChrome.tabs.onRemoved.dispatch(mockTab1);

      const updateTabPost = stubbedTabPostCalls.firstCall.args[1].variables.input;
      expect(updateTabPost.tabId).equals(mockTab1.id);
      expect(updateTabPost.closedTimestamp).is.not.empty;
    });

    context('and the closed tab was active', function () {
      it('should include last active timestamp in post call', async function () {
        mockChrome.tabs.onActivated.dispatch(mockTab1);

        expect(stubbedTabPostCalls.secondCall).to.be.null;

        mockChrome.tabs.onRemoved.dispatch(mockTab1);

        const updateTabPost = stubbedTabPostCalls.secondCall.args[1].variables.input;
        expect(updateTabPost.lastActiveTimestamp).is.not.empty;
      });
    });
  });
});
