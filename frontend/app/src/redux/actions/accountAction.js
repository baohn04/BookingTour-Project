import { loginAdmin, logoutAdmin, getAdminInfo } from "../../services/adminAuthServices"
import { setCookie, deleteCookie } from "../../utils/cookie"

export const USER_LOGIN_REQUEST = "USER_LOGIN_REQUEST"
export const USER_LOGIN_FAILED = "USER_LOGIN_FAILED"
export const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS"
export const USER_LOGOUT = "USER_LOGOUT"

export const doLogin = (dataLogin) => {
  return async (dispatch) => {
    dispatch({ type: USER_LOGIN_REQUEST });
    try {
      const result = await loginAdmin(dataLogin);
      if (result.accessToken) {
        setCookie('accessToken', result.accessToken, 1);
        dispatch({ type: USER_LOGIN_SUCCESS, data: result });
      } else {
        dispatch({ type: USER_LOGIN_FAILED, error: result.message });
      }
      return result;
    } catch (error) {
      dispatch({ type: USER_LOGIN_FAILED, error: "Đã có lỗi xảy ra" });
      console.log("Error: ", error);
      return null;
    }
  }
}

export const doLogout = () => {
  return async (dispatch) => {
    try {
      const result = await logoutAdmin();
      deleteCookie('accessToken');
      dispatch({ type: USER_LOGOUT });
      return result;
    } catch (error) {
      console.log("Logout error: ", error);
      return null;
    }
  }
}

// Gọi khi trang được reload (F5) để lấy lại thông tin
export const getUserInfo = () => {
  return async (dispatch) => {
    try {
      const result = await getAdminInfo();
      if (result.userName) {
        dispatch({ type: USER_LOGIN_SUCCESS, data: result });
      }
    } catch (error) {
      console.log("Fetch admin info error: ", error);
    }
  }
}