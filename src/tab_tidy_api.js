
module.exports = ({ baseApi }) => {
  const createTabMutationString = `mutation CreateTab($CreateTabInput: CreateTabInput!) {
    createTab(createTabInput: $CreateTabInput) {
      tab {
        tabId
      }
    }
  }`

  const updateTabMutationString = `mutation UpdateTab($UpdateTabInput: UpdateTabInput!) {
    updateTab(updateTabInput: $UpdateTabInput) {
      tab {
        tabId
      }
    }
  }`

  return {
    createTab: async (tab) => {
      await baseApi.post(
        '',
        {
          query: createTabMutationString,
          variables: { CreateTabInput: tab },
        },
      )
    },

    updateTab: async (tab) => {
      try {
        await baseApi.post(
          '',
          {
            query: updateTabMutationString,
            variables: { UpdateTabInput: tab },
          },
        )
      } catch (error) {
        console.log(error.response)
      }
    },
  }
}

