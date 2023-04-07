import { csrfFetch } from "./csrf";

const LOGIN_USER = "session/loginUser";
const LOGOUT_USER = "session/logoutUser";

const loginUser = (user) => {
    return {
        type: LOGIN_USER,
        user: user,
    };
};

const logoutUser = () => {
    return {
        type: LOGOUT_USER,
    };
};

export const loginUserThunk = (user) => async (dispatch) => {
    const { credential, password } = user;
    const response = await csrfFetch("/api/session", {
        method: "POST",
        body: JSON.stringify({
            credential,
            password,
        }),
    });
    const data = await response.json();
    dispatch(loginUser(data.user));
    return response;
};

export const restoreUserThunk = () => async (dispatch) => {
    const response = await csrfFetch("/api/session");
    const data = await response.json();
    dispatch(loginUser(data.user));
    return response;
};

export const signupThunk = (user) => async (dispatch) => {
    const { username, firstName, lastName, email, password } = user;
    const response = await csrfFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username,
        firstName,
        lastName,
        email,
        password,
      }),
    });
    const data = await response.json();
    dispatch(loginUser(data.user));
    return response;
};

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOGIN_USER:
            newState = Object.assign({}, state);
            newState.user = action.user;
            return newState;
        case LOGOUT_USER:
            newState = Object.assign({}, state);
            newState.user = null;
            return newState;
        default:
            return state;
    }
};

export default sessionReducer;
