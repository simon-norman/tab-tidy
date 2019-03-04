const createTabTidyApi = require('../src/tab_tidy_api')
const createTabRecorder = require('../src/tab')
const createBaseApi = require('../src/base_api')
const sinon = require('sinon')

const stubBaseApi = (baseApi) => {
  const stubbedTabPost = sinon.stub(baseApi, 'post')
  return stubbedTabPost.returns(Promise.resolve(200))
}

module.exports = () => {
  const baseApi = createBaseApi({
    baseURL: 'fake_tab_api.com',
  })
  const stubbedTabPost = stubBaseApi(baseApi)

  const tabTidyApi = createTabTidyApi({ baseApi })

  return { tabRecorder: createTabRecorder(tabTidyApi), stubbedTabPost }
}
