
module.exports = ({ baseApi }) => {
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
      baseApi.post(
        '/',
        {
          query: createTabMutationString,
          variables: { input: tab },
        },
      );
    },

    updateTab: (tab) => {
      baseApi.post(
        '/',
        {
          query: updateTabMutationString,
          variables: { input: tab },
        },
      );
    },
  };
};

