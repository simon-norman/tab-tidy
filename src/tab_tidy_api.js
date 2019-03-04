
module.exports = ({ baseApi }) => {
  const tabMutationString = (action) => {
    const actionLower = action.toLowerCase()
    return `mutation ${actionLower}Tab($${action}TabInput: ${action}TabInput!) {
      ${actionLower}Tab(${actionLower}TabInput: ${action}TabInput) {
        tab {
          tabId
        }
      }
    }`
  }

  const inactiveRecMutationString = (action) => {
    const actionLower = action.toLowerCase()
    return `mutation ${actionLower}InactiveRec($${action}InactiveRecInput: ${action}InactiveRecInput!) {
      ${actionLower}InactiveRec(${actionLower}InactiveRecInput: ${action}InactiveRecInput) {
        inactiveRec {
          id
        }
      }
    }`
  }

  return {
    createTab: async (tab) => {
      await baseApi.post(
        '',
        {
          query: tabMutationString('Create'),
          variables: { CreateTabInput: tab },
        },
      )
    },

    updateTab: async (tab) => {
      try {
        await baseApi.post(
          '',
          {
            query: tabMutationString('Update'),
            variables: { UpdateTabInput: tab },
          },
        )
      } catch (error) {
        console.log(error.response)
      }
    },

    createInactiveRec: async (inactiveRec) => {
      try {
        await baseApi.post(
          '',
          {
            query: inactiveRecMutationString('Create'),
            variables: { CreateInactiveRecInput: inactiveRec },
          },
        )
      } catch (error) {
        console.log(error.response)
      }
    },
  }
}

