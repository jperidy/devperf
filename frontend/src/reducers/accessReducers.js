import { 
    ACCESS_LIST_FAIL, 
    ACCESS_LIST_REQUEST, 
    ACCESS_LIST_RESET, 
    ACCESS_LIST_SUCCESS, 
    ACCESS_UPDATE_FRONTACCESS_FAIL, 
    ACCESS_UPDATE_FRONTACCESS_REQUEST,
    ACCESS_UPDATE_FRONTACCESS_SUCCESS,
    ACCESS_UPDATE_FRONTACCESS_RESET
} from "../constants/accessConstants";

export const accessListReducer = (state = {}, action) => {
    switch (action.type) {
        case ACCESS_LIST_REQUEST:
            return { loading: true };
        case ACCESS_LIST_SUCCESS:
            return { loading: false, access: action.payload };
        case ACCESS_LIST_FAIL:
            return { loading: false, error: action.payload };
        case ACCESS_LIST_RESET:
            return {}
        default:
            return state;
    }
};

export const accessFrontUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case ACCESS_UPDATE_FRONTACCESS_REQUEST:
            return { loading: true };
        case ACCESS_UPDATE_FRONTACCESS_SUCCESS:
            return { loading: false, success: true };
        case ACCESS_UPDATE_FRONTACCESS_FAIL:
            return { loading: false, error: action.payload };
        case ACCESS_UPDATE_FRONTACCESS_RESET:
            return {}
        default:
            return state;
    }
};