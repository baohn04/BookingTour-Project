const INITIAL_STATE = {
  userInfo: {
    userName: "",
    email: "",
    role: {},
    accessToken: "",
    refreshToken: ""
  },
  isLoading: false,
  errMessage: ""
}

const accountReducer = (state = INITIAL_STATE, action) => {
  let newState = state;
  switch (action.type) {
    case "USER_LOGIN_REQUEST": {
      newState = {
        ...state,
        isLoading: true,
        errMessage: ""
      };
      break;
    }
    case "USER_LOGIN_FAILED": {
      newState = {
        ...state,
        isLoading: false,
        errMessage: action.error
      };
      break;
    }
    case "USER_LOGIN_SUCCESS": {
      newState = {
        ...state,
        userInfo: action.data,
        isLoading: false,
        errMessage: ""
      };
      break;
    }
    case "USER_LOGOUT": {
      newState = INITIAL_STATE;
      break;
    }
    default:
      return state;
  }
  return newState;
};

export default accountReducer;