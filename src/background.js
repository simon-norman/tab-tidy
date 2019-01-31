const axios = require('axios');
const createTabTidyApi = require('../src/tab_tidy_api');
const createTabRecorder = require('../src/tab_recorder');
const config = require('./config.js');

const tabTidyApi = createTabTidyApi({ tabApiConfig: config.tabApi, axios });

createTabRecorder(tabTidyApi);
