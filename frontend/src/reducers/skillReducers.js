import { 
    SKILL_LIST_REQUEST, 
    SKILL_LIST_RESET, 
    SKILL_LIST_SUCCESS, 
    SKILL_LIST_FAIL, 
    SKILL_DELETE_REQUEST,
    SKILL_DELETE_SUCCESS,
    SKILL_DELETE_FAIL,
    SKILL_DELETE_RESET
} from "../constants/skillsConstants";

export const skillListReducer = (state= {}, action) => {
    switch(action.type) {
        case SKILL_LIST_REQUEST:
            return { loading: true, success: false };
        case SKILL_LIST_SUCCESS:
            return { 
                loading: false, 
                success: true, 
                skills: action.payload.skills,
                pages: action.payload.pages,
                page: action.payload.page,
                count: action.payload.count
             };
        case SKILL_LIST_FAIL:
            return { loading: false, error: action.payload };
        case SKILL_LIST_RESET:
            return {};
        default:
            return state ;
    }
};

export const skillDelteReducer = (state= {}, action) => {
    switch(action.type) {
        case SKILL_DELETE_REQUEST:
            return { loading: true, success: false };
        case SKILL_DELETE_SUCCESS:
            return { loading: false, success: true };
        case SKILL_DELETE_FAIL:
            return { loading: false, error: action.payload };
        case SKILL_DELETE_RESET:
            return {};
        default:
            return state ;
    }
};