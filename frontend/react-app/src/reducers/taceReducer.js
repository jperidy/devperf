import { 
    TACE_CREATE_FAIL,
    TACE_CREATE_REQUEST,
    TACE_CREATE_RESET,
    TACE_CREATE_SUCCESS,
} from "../constants/taceConstants";

export const createTaceReducer = (state= {}, action) => {
    switch(action.type) {
        case TACE_CREATE_REQUEST:
            return { loading: true, success: false };
        case TACE_CREATE_SUCCESS:
            return { loading: false, taceData: action.payload };
        case TACE_CREATE_FAIL:
            return { loading: false, error: action.payload };
        case TACE_CREATE_RESET:
            return {};
        default:
            return state ;
    }
};