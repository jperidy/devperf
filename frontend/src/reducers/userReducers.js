import { USER_LOGIN_FAIL, 
    USER_LOGIN_REQUEST, 
    USER_LOGIN_SUCCESS, 
    USER_LOGOUT, 
    USER_ADMIN_CHANGE_PRACTICE,
    USER_REGISTER_REQUEST, 
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
    USER_REGISTER_RESET,
    USER_DETAILS_FAIL,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_REQUEST, 
    USER_DETAILS_RESET,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_UPDATE_PROFILE_FAIL,
    USER_UPDATE_PROFILE_RESET,
    USER_LIST_REQUEST,
    USER_LIST_SUCCESS,
    USER_LIST_FAIL,
    USER_LIST_RESET,
    USER_DELETE_REQUEST,
    USER_DELETE_SUCCESS,
    USER_DELETE_FAIL,
    USER_DELETE_RESET,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_RESET,
    USER_UPDATE_FAIL,
    USER_REDIRECT_AZ_REQUEST,
    USER_REDIRECT_AZ_SUCCESS,
    USER_REDIRECT_AZ_FAIL,
    USER_REDIRECT_AZ_RESET,
    USER_ADMIN_CHANGE_PRACTICE_FAIL,
    USER_TO_CREATE_REQUEST,
    USER_TO_CREATE_SUCCESS,
    USER_TO_CREATE_FAIL,
    USER_TO_CREATE_RESET,
    USER_CREATE_REQUEST,
    USER_CREATE_SUCCESS,
    USER_CREATE_FAIL,
    USER_CREATE_RESET
} from "../constants/userConstants";

/**
 * @function userLoginReducer
 * @param {object} state - {loading, userInfo, error} 
 * @param {object} action - action to be reduced 
 * @returns {objetct} - new user login state {loading, userInfo, error}
 */
export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return { loading: true };
        case USER_LOGIN_SUCCESS:
            return { loading: false, userInfo: action.payload };
        case USER_LOGIN_FAIL:
            return { loading: false, error: action.payload };
        case USER_LOGOUT:
            return {};
        case USER_ADMIN_CHANGE_PRACTICE:
            return { loading: false, userInfo: action.payload };
        case USER_ADMIN_CHANGE_PRACTICE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const userRedirectAzReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_REDIRECT_AZ_REQUEST:
            return { loading: true };
        case USER_REDIRECT_AZ_SUCCESS:
            return { loading: false, redirectURL: action.payload.redirectURL };
        case USER_REDIRECT_AZ_FAIL:
            return { loading: false, error: action.payload };
        case USER_REDIRECT_AZ_RESET:
            return {};
        default:
            return state;
    }
};

export const userRegisterReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return { loading: true };
        case USER_REGISTER_SUCCESS:
            return { loading: false, userInfo: action.payload };
        case USER_REGISTER_FAIL:
            return { loading: false, error: action.payload };
        case USER_REGISTER_RESET:
            return {};
        default:
            return state;
    }
};

export const userDetailsReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_DETAILS_REQUEST:
            return { loading: true };
        case USER_DETAILS_SUCCESS:
            return { loading: false, user: action.payload };
        case USER_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        case USER_DETAILS_RESET:
            return {}
        default:
            return state;
    }
};

export const userUpdateProfileReducer = (state = { }, action) => {
    switch (action.type) {
        case USER_UPDATE_PROFILE_REQUEST:
            return { loading: true };
        case USER_UPDATE_PROFILE_SUCCESS:
            return { loading: false, success: true, userInfo: action.payload };
        case USER_UPDATE_PROFILE_FAIL:
            return { loading: false, error: action.payload };
        case USER_UPDATE_PROFILE_RESET:
            return { };
        default:
            return state;
    }
};

export const userListReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LIST_REQUEST:
            return { loading: true };
        case USER_LIST_SUCCESS:
            return { 
                loading: false, 
                users: action.payload.users,
                pages: action.payload.pages,
                page: action.payload.page,
                count: action.payload.count 
            };
        case USER_LIST_FAIL:
            return { loading: false, error: action.payload };
        case USER_LIST_RESET:
            return { };
        default:
            return state;
    }
};


export const userDeleteReducer = (state = { }, action) => {
    switch (action.type) {
        case USER_DELETE_REQUEST:
            return { loading: true };
        case USER_DELETE_SUCCESS:
            return { loading: false, success: true };
        case USER_DELETE_FAIL:
            return { loading: false, error: action.payload };
        case USER_DELETE_RESET:
            return { };
        default:
            return state;
    }
};


export const userUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_UPDATE_REQUEST:
            return { loading: true };
        case USER_UPDATE_SUCCESS:
            return { loading: false, success: true };
        case USER_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        case USER_UPDATE_RESET:
            return {}
        default:
            return state;
    }
};

export const userToCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_TO_CREATE_REQUEST:
            return { loading: true };
        case USER_TO_CREATE_SUCCESS:
            return {
                loading: false, 
                usersListToCreate: action.payload.usersListToCreate,
                pages: action.payload.pages,
                page: action.payload.page,
                count: action.payload.count
            };
        case USER_TO_CREATE_FAIL:
            return { loading: false, error: action.payload };
        case USER_TO_CREATE_RESET:
            return {}
        default:
            return state;
    }
};

export const userCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_CREATE_REQUEST:
            return { loading: true };
        case USER_CREATE_SUCCESS:
            return {loading: false, success: true, consultantId: action.payload.consultantId};
        case USER_CREATE_FAIL:
            return { loading: false, error: action.payload.message, consultantId: action.payload.consultantId };
        case USER_CREATE_RESET:
            return {}
        default:
            return state;
    }
};