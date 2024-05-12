const initialState = {
    userProfile: {}
  };
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_USER_PROFILE':
        return {
          ...state,
          userProfile: action.payload
        };
      default:
        return state;
    }
  };
  
  export default reducer;