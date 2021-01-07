import { 
    DEAL_ALL_LIST_FAIL,
    DEAL_ALL_LIST_REQUEST,
    DEAL_ALL_LIST_RESET,
    DEAL_ALL_LIST_SUCCESS,
    DEAL_CREATE_FAIL, 
    DEAL_CREATE_REQUEST, 
    DEAL_CREATE_RESET, 
    DEAL_CREATE_SUCCESS, 
    DEAL_DELETE_FAIL, 
    DEAL_DELETE_REQUEST,
    DEAL_DELETE_RESET,
    DEAL_DELETE_SUCCESS,
    DEAL_EDIT_FAIL,
    DEAL_EDIT_REQUEST,
    DEAL_EDIT_RESET,
    DEAL_EDIT_SUCCESS,
    DEAL_UPDATE_FAIL,
    DEAL_UPDATE_REQUEST,
    DEAL_UPDATE_RESET,
    DEAL_UPDATE_SUCCESS
} from "../constants/dealConstants";

export const dealCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case DEAL_CREATE_REQUEST:
            return { loading: true };
        case DEAL_CREATE_SUCCESS:
            return { loading: false, success: true, createId: action.payload };
        case DEAL_CREATE_FAIL:
            return { loading: false, error: action.payload };
        case DEAL_CREATE_RESET:
            return {}
        default:
            return state;
    }
};

export const dealUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case DEAL_UPDATE_REQUEST:
            return { loading: true };
        case DEAL_UPDATE_SUCCESS:
            return { loading: false, success: true };
        case DEAL_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        case DEAL_UPDATE_RESET:
            return {}
        default:
            return state;
    }
};

export const dealAllListReducer = (state = {}, action) => {
    switch (action.type) {
        case DEAL_ALL_LIST_REQUEST:
            return { loading: true };
        case DEAL_ALL_LIST_SUCCESS:
            return { 
                loading: false, 
                success: true,
                deals: action.payload.deals,
                pages: action.payload.pages,
                page: action.payload.page,
                count: action.payload.count
            };
        case DEAL_ALL_LIST_FAIL:
            return { loading: false, error: action.payload };
        case DEAL_ALL_LIST_RESET:
            return {}
        default:
            return state;
    }
};

export const dealDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case DEAL_DELETE_REQUEST:
            return { loading: true };
        case DEAL_DELETE_SUCCESS:
            return { loading: false, success: true };
        case DEAL_DELETE_FAIL:
            return { loading: false, error: action.payload };
        case DEAL_DELETE_RESET:
            return {}
        default:
            return state;
    }
};

export const dealEditeReducer = (state = {}, action) => {
    switch (action.type) {
        case DEAL_EDIT_REQUEST:
            return { loading: true };
        case DEAL_EDIT_SUCCESS:
            return { loading: false, success: true, deal: action.payload };
        case DEAL_EDIT_FAIL:
            return { loading: false, error: action.payload };
        case DEAL_EDIT_RESET:
            return {}
        default:
            return state;
    }
};