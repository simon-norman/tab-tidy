const createTabTidyApi = require('../src/tab_tidy_api')
const createTabRecorder = require('../src/tab_recorder')
const createBaseApi = require('./base_api')
const config = require('./config.js')

const baseApi = createBaseApi({ apiConfig: config.tabApi })

const tabTidyApi = createTabTidyApi({ baseApi })

createTabRecorder(tabTidyApi)
