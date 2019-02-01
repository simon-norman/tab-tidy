
const axios = require('axios');
const retryAxios = require('retry-axios');

let baseApi;

// Retry-axios defaults are to retry 3 times on following http errors:
// [[100, 199], [429, 429], [500, 599]]
const setAxiosToRetryOnSpecificErrorCodes = () => {
  baseApi.defaults.raxConfig = {
    instance: baseApi,
  };
  retryAxios.attach(baseApi);
};

module.exports = ({ apiConfig }) => {
  baseApi = axios.create(apiConfig);

  setAxiosToRetryOnSpecificErrorCodes();

  return baseApi;
};

