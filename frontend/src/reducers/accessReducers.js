import { 
    ACCESS_LIST_FAIL, 
    ACCESS_LIST_REQUEST, 
    ACCESS_LIST_RESET, 
    ACCESS_LIST_SUCCESS 
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