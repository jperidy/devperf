import { DEAL_CREATE_FAIL, DEAL_CREATE_REQUEST, DEAL_CREATE_RESET, DEAL_CREATE_SUCCESS } from "../constants/dealConstants";

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