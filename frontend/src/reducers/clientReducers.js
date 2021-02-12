import { 
    CLIENT_ALL_FAIL, 
    CLIENT_ALL_REQUEST, 
    CLIENT_ALL_RESET, 
    CLIENT_ALL_SUCCESS, 
    CLIENT_CREATE_FAIL, 
    CLIENT_CREATE_REQUEST,
    CLIENT_CREATE_RESET,
    CLIENT_CREATE_SUCCESS,
    CLIENT_UPDATE_FAIL,
    CLIENT_UPDATE_REQUEST,
    CLIENT_UPDATE_SUCCESS,
    CLIENT_UPDATE_RESET
} from "../constants/clientConstants";

export const clientAllReducer = (state = { }, action) => {
    switch (action.type) {
        case CLIENT_ALL_REQUEST:
            return { loading: true };
        case CLIENT_ALL_SUCCESS:
            return { 
                loading: false, 
                success: true, 
                clients: action.payload.clients,
                page: action.payload.page,
                pages: action.payload.pages,
                count: action.payload.count
            };
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

export const clientUpdateReducer = (state = { }, action) => {
    switch (action.type) {
        case CLIENT_UPDATE_REQUEST:
            return { loading: true };
        case CLIENT_UPDATE_SUCCESS:
            return { loading: false, success: true };
        case CLIENT_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        case CLIENT_UPDATE_RESET:
            return {}
        default:
            return state;
    }
};