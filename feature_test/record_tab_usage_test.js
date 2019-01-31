const chai = require('chai');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const axios = require('axios');
const mockChrome = require('sinon-chrome');
const createTabTidyApi = require('../src/tab_tidy_api');
const createTabRecorder = require('../src/tab_recorder');

chai.use(sinonChai);
const { expect } = chai;

describe('Record tab usage', function () {
  let stubbedTabPostCalls;
  let mockTabApiConfig;
  let mockTab1;
  let mockTab2;

  const stubTabPostCalls = () => {
    stubbedTabPostCalls = sinon.stub(axios, 'post');
    stubbedTabPostCalls.returns(Promise.resolve(200));
  };

  const setUpTabRecorder = () => {
    mockTabApiConfig = {
      baseUrl: 'fake_tab_api.com',
    };
    const tabTidyApi = createTabTidyApi({ tabApiConfig: mockTabApiConfig, axios });

    createTabRecorder(tabTidyApi);
  };

  before(() => {
    global.chrome = mockChrome;

    stubTabPostCalls();

    setUpTabRecorder();

    mockTab1 = { id: 'mock_tab_1' };
    mockTab2 = { id: 'mock_tab_2' };
  });

  afterEach(() => {
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
    it('should update api with last inactive timestamp of that tab', async function () {
      mockChrome.tabs.onCreated.dispatch(mockTab1);
      mockChrome.tabs.onActivated.dispatch(mockTab2);

      const updateTabPost = stubbedTabPostCalls.secondCall.args[1].variables.input;
      expect(updateTabPost.tabId).equals(mockTab1.id);
      expect(updateTabPost.lastActiveTimestamp).is.not.empty;
    });
  });
});
