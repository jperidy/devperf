import { 
    CLIENT_ALL_FAIL, 
    CLIENT_ALL_REQUEST, 
    CLIENT_ALL_RESET, 
    CLIENT_ALL_SUCCESS, 
    CLIENT_CREATE_FAIL, 
    CLIENT_CREATE_REQUEST,
    CLIENT_CREATE_RESET,
    CLIENT_CREATE_SUCCESS
} from "../constants/clientConstants";

export const clientAllReducer = (state = { }, action) => {
    switch (action.type) {
        case CLIENT_ALL_REQUEST:
            return { loading: true };
        case CLIENT_ALL_SUCCESS:
            return { loading: false, success: true, clients: action.payload };
        case CLIENT_ALL_FAIL:
            return { loading: false, error: action.payload };
        case CLIENT_ALL_RESET:
            return {}
        default:
            return state;
    }
};

export const clientCreateReducer = (state = { }, action) => {
    switch (action.type) {
        case CLIENT_CREATE_REQUEST:
            return { loading: true };
        case CLIENT_CREATE_SUCCESS:
            return { loading: false, success: true };
        case CLIENT_CREATE_FAIL:
            return { loading: false, error: action.payload };
        case CLIENT_CREATE_RESET:
            return {}
        default:
            return state;
    }
};