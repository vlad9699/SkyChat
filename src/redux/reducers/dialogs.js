export const ProcessReducer = (state = {}, action) => {
  switch (action.type) {
    case 'DIALOGS':
      return { ...action.payload }

    default:
      return state
  }
}
export default ProcessReducer
