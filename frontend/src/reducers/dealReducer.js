import { 
    DEAL_ALL_LIST_FAIL,
    DEAL_ALL_LIST_REQUEST,
    DEAL_ALL_LIST_RESET,
    DEAL_ALL_LIST_SUCCESS,
    DEAL_CREATE_FAIL, 
    DEAL_CREATE_REQUEST, 
    DEAL_CREATE_RESET, 
    DEAL_CREATE_SUCCESS 
} from "../constants/dealConstants";

export const dealCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case DEAL_CREATE_REQUEST:
            return { loading: true };
        case DEAL_CREATE_SUCCESS:
            return { loading: false, success: true };
        case DEAL_CREATE_FAIL:
            return { loading: false, error: action.payload };
        case DEAL_CREATE_RESET:
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
                page: action.payload.page
            };
        case DEAL_ALL_LIST_FAIL:
            return { loading: false, error: action.payload };
        case DEAL_ALL_LIST_RESET:
            return {}
        default:
            return state;
    }
};