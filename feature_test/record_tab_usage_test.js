const chai = require('chai');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const axios = require('axios');
const chrome = require('sinon-chrome');
const createTabTidyApi = require('../src/tab_tidy_api');
const createTabRecorder = require('../src/tab_recorder');

chai.use(sinonChai);
const { expect } = chai;

describe('Record tab usage', function () {
  let stubbedCreateTabPost;
  let mockTabApiConfig;

  const promisifyTimeout = timeoutPeriodInMilliseconds => new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeoutPeriodInMilliseconds);
  });


  before(() => {
    global.chrome = chrome;

    stubbedCreateTabPost = sinon.stub(axios, 'post');
    stubbedCreateTabPost.returns(Promise.resolve(200));

    mockTabApiConfig = {
      baseUrl: 'fake_tab_api.com',
    };

    const tabTidyApi = createTabTidyApi({ tabApiConfig: mockTabApiConfig, axios });

    createTabRecorder(tabTidyApi);
  });

  context('When user opens a new tab', function () {
    it('should post new tab to api', async function () {
      const mockTab = { id: 'mock_id' };
      chrome.tabs.onCreated.dispatch(mockTab);
      promisifyTimeout(1);

      const newTabPost = stubbedCreateTabPost.firstCall.args[1].variables.input;
      expect(newTabPost.tabId).equals(mockTab.id);
      expect(newTabPost.createdTimestamp).is.not.empty;
    });
  });
});
