
module.exports = ({ tabApiConfig, axios }) => {
  const createTabMutationString = `mutation createTab($input: TabInput) {
    createTab(input: $input) {
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
  };
};

