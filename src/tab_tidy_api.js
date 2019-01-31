
module.exports = ({ tabApiConfig, axios }) => {
  const createTabMutationString = `mutation createTab($input: TabInput) {
    createTab(input: $input) {
    }
  }`;

  const updateTabMutationString = `mutation updateTab($input: TabInput) {
    updateTab(input: $input) {
    }
  }`;

  return {
    createTab: (tab) => {
      axios.post(
        tabApiConfig.baseUrl,
        {
          query: createTabMutationString,
          variables: { input: tab },
        },
      );
    },

    updateTab: (tab) => {
      axios.post(
        tabApiConfig.baseUrl,
        {
          query: updateTabMutationString,
          variables: { input: tab },
        },
      );
    },
  };
};

