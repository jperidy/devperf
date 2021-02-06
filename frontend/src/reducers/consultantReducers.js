import {
    CONSULTANTS_MY_DETAILS_REQUEST,
    CONSULTANTS_MY_DETAILS_SUCCESS,
    CONSULTANTS_MY_DETAILS_FAIL,
    CONSULTANTS_MY_DETAILS_FOCUS,
    CONSULTANTS_MY_DETAILS_RESET,
    CONSULTANT_MY_REQUEST,
    CONSULTANT_MY_SUCCESS,
    CONSULTANT_MY_FAIL,
    CONSULTANT_MY_RESET,
    CONSULTANT_MY_UPDATE_REQUEST,
    CONSULTANT_MY_UPDATE_SUCCESS,
    CONSULTANT_MY_UPDATE_FAIL,
    CONSULTANT_MY_UPDATE_RESET,
    CONSULTANTS_ALL_ADMIN_DETAILS_REQUEST,
    CONSULTANTS_ALL_ADMIN_DETAILS_SUCCESS,
    CONSULTANTS_ALL_ADMIN_DETAILS_FAIL,
    CONSULTANTS_ALL_ADMIN_DETAILS_RESET,
    CONSULTANT_CREATE_REQUEST,
    CONSULTANT_CREATE_SUCCESS,
    CONSULTANT_CREATE_FAIL,
    CONSULTANT_CREATE_RESET,
    CONSULTANT_CDM_LIST_REQUEST,
    CONSULTANT_CDM_LIST_SUCCESS,
    CONSULTANT_CDM_LIST_FAIL,
    CONSULTANT_CDM_LIST_RESET,
    CONSULTANT_PRACTICE_LIST_REQUEST,
    CONSULTANT_PRACTICE_LIST_SUCCESS,
    CONSULTANT_PRACTICE_LIST_FAIL,
    CONSULTANT_PRACTICE_LIST_RESET,
    CONSULTANT_DELETE_REQUEST,
    CONSULTANT_DELETE_SUCCESS,
    CONSULTANT_DELETE_FAIL,
    CONSULTANT_DELETE_RESET,
    CONSULTANT_UPDATE_COMMENT_REQUEST,
    CONSULTANT_UPDATE_COMMENT_SUCCESS,
    CONSULTANT_UPDATE_COMMENT_FAIL,
    CONSULTANT_UPDATE_COMMENT_RESET,
    //CONSULTANT_ALL_ACCESS_REQUEST,
    //CONSULTANT_ALL_ACCESS_SUCCESS,
    //CONSULTANT_ALL_ACCESS_FAIL,
    //CONSULTANT_ALL_ACCESS_RESET,
    CONSULTANT_ALL_SKILLS_REQUEST,
    CONSULTANT_ALL_SKILLS_SUCCESS,
    CONSULTANT_ALL_SKILLS_FAIL,
    CONSULTANT_ALL_SKILLS_RESET,
    CONSULTANT_ADD_SKILL_REQUEST,
    CONSULTANT_ADD_SKILL_SUCCESS,
    CONSULTANT_ADD_SKILL_FAIL,
    CONSULTANT_ADD_SKILL_RESET,
    CONSULTANT_DELETE_SKILL_REQUEST,
    CONSULTANT_DELETE_SKILL_SUCCESS,
    CONSULTANT_DELETE_SKILL_FAIL,
    CONSULTANT_DELETE_SKILL_RESET,
    CONSULTANT_UPDATE_SKILL_REQUEST,
    CONSULTANT_UPDATE_SKILL_SUCCESS,
    CONSULTANT_UPDATE_SKILL_FAIL,
    CONSULTANT_UPDATE_SKILL_RESET,
    CONSULTANT_ALL_STAFF_REQUEST,
    CONSULTANT_ALL_STAFF_SUCCESS,
    CONSULTANT_ALL_STAFF_FAIL,
    CONSULTANT_ALL_STAFF_RESET,
    CONSULTANT_SKILLS_REQUEST,
    CONSULTANT_SKILLS_SUCCESS,
    CONSULTANT_SKILLS_FAIL,
    CONSULTANT_SKILLS_RESET,
    CONSULTANT_CDM_REQUEST,
    CONSULTANT_CDM_SUCCESS,
    CONSULTANT_CDM_FAIL,
    CONSULTANT_CDM_RESET
} from '../constants/consultantConstants';

export const consultantsMyListReducer = (state = {focus: 0}, action) => {
    switch (action.type) {
        case CONSULTANTS_MY_DETAILS_REQUEST:
            return { ...state, loading: true };
        case CONSULTANTS_MY_DETAILS_SUCCESS:
            return { ...state, loading: false, consultantsMy: action.payload };
        case CONSULTANTS_MY_DETAILS_FAIL:
            return { ...state, loading: false, error: action.payload };
        case CONSULTANTS_MY_DETAILS_FOCUS:
            return { ...state, focus: action.payload }
        case CONSULTANTS_MY_DETAILS_RESET:
            return { focus: 0 }
        default:
            return state;
    }
};

/*
export const consultantsMyAdminListReducer = (state = {
    loading: true, 
    consultantsMyAdmin: [
        {
            name: '',
            matricule: '',
            arrival: '',
            leaving: '',
            seriority: '',
            comment: '',
            practice: ''
        }],
    focus: 0
}, action) => {
    switch (action.type) {
        case CONSULTANTS_ALL_ADMIN_DETAILS_REQUEST:
            return { ...state, loading: true };
        case CONSULTANTS_ALL_ADMIN_DETAILS_SUCCESS:
            return { ...state, loading: false, consultantsMyAdmin: action.payload };
        case CONSULTANTS_ALL_ADMIN_DETAILS_FAIL:
            return { ...state, loading: false, error: action.payload };
        case CONSULTANTS_ALL_ADMIN_DETAILS_FOCUS:
            return { ...state, focus: action.payload }
        case CONSULTANTS_ALL_ADMIN_DETAILS_RESET:
            return { loading: true, consultantsMyAdmin: [
                                {
                                    name: '',
                                    matricule: '',
                                    arrival: '',
                                    leaving: '',
                                    seriority: '',
                                    comment: '',
                                    practice: ''
                                }], focus: 0 }
        default:
            return state;
    }
};
*/
/*
export const consultantMyReducer = (state = { consultant: {} }, action) => {
    switch (action.type) {
        case CONSULTANT_MY_REQUEST:
            return { ...state, loading: true };
        case CONSULTANT_MY_SUCCESS:
            return { loading: false, consultant: action.payload };
        case CONSULTANT_MY_FAIL:
            return { loading: false, error: action.payload };
        case CONSULTANT_MY_RESET:
            return { consultant: {} }
        default:
            return state;
    }
};
*/

export const consultantMyReducer = (state = {}, action) => {
    switch (action.type) {
        case CONSULTANT_MY_REQUEST:
            return { loading: true };
        case CONSULTANT_MY_SUCCESS:
            return { loading: false, consultant: action.payload };
        case CONSULTANT_MY_FAIL:
            return { loading: false, error: action.payload };
        case CONSULTANT_MY_RESET:
            return {}
        default:
            return state;
    }
};

export const consultantMyUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case CONSULTANT_MY_UPDATE_REQUEST:
            return { loading: true };
        case CONSULTANT_MY_UPDATE_SUCCESS:
            return { loading: false, success: true };
        case CONSULTANT_MY_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        case CONSULTANT_MY_UPDATE_RESET:
            return { }
        default:
            return state;
    }
};

export const consultantCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case CONSULTANT_CREATE_REQUEST:
            return { loading: true };
        case CONSULTANT_CREATE_SUCCESS:
            return { loading: false, success: true, consultantCreated: action.payload };
        case CONSULTANT_CREATE_FAIL:
            return { loading: false, error: action.payload };
        case CONSULTANT_CREATE_RESET:
            return { }
        default:
            return state;
    }
};

export const consultantDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case CONSULTANT_DELETE_REQUEST:
            return { loading: true };
        case CONSULTANT_DELETE_SUCCESS:
            return { loading: false, success: true };
        case CONSULTANT_DELETE_FAIL:
            return { loading: false, error: action.payload };
        case CONSULTANT_DELETE_RESET:
            return { }
        default:
            return state;
    }
};

export const consultantCDMListReducer = (state = {}, action) => {
    switch (action.type) {
        case CONSULTANT_CDM_LIST_REQUEST:
            return { loading: true };
        case CONSULTANT_CDM_LIST_SUCCESS:
            return { loading: false, cdmList: action.payload };
        case CONSULTANT_CDM_LIST_FAIL:
            return { loading: false, error: action.payload };
        case CONSULTANT_CDM_LIST_RESET:
            return {}
        default:
            return state;
    }
};

export const consultantPracticeListReducer = (state = {}, action) => {
    switch (action.type) {
        case CONSULTANT_PRACTICE_LIST_REQUEST:
            return { loading: true };
        case CONSULTANT_PRACTICE_LIST_SUCCESS:
            return { loading: false, practiceList: action.payload };
        case CONSULTANT_PRACTICE_LIST_FAIL:
            return { loading: false, error: action.payload };
        case CONSULTANT_PRACTICE_LIST_RESET:
            return {}
        default:
            return state;
    }
};

export const consultantUpdateCommentReducer = (state = { }, action) => {
    switch (action.type) {
        case CONSULTANT_UPDATE_COMMENT_REQUEST:
            return { loading: true };
        case CONSULTANT_UPDATE_COMMENT_SUCCESS:
            return { loading: false, success: true };
        case CONSULTANT_UPDATE_COMMENT_FAIL:
            return { loading: false, error: action.payload };
        case CONSULTANT_UPDATE_COMMENT_RESET:
            return {}
        default:
            return state;
    }
};

export const consultantsMyAdminListReducer = (state = {}, action) => {
    switch (action.type) {
        case CONSULTANTS_ALL_ADMIN_DETAILS_REQUEST:
            return { loading: true };
        case CONSULTANTS_ALL_ADMIN_DETAILS_SUCCESS:
            return { 
                loading: false, 
                consultantsMyAdmin: action.payload.consultants,
                pages: action.payload.pages,
                page: action.payload.page,
                count: action.payload.count
            };
        case CONSULTANTS_ALL_ADMIN_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        case CONSULTANTS_ALL_ADMIN_DETAILS_RESET:
            return {}
        default:
            return state;
    }
};

/*
export const consultantAllAccessReducer = (state = {}, action) => {
    switch (action.type) {
        case CONSULTANT_ALL_ACCESS_REQUEST:
            return { loading: true };
        case CONSULTANT_ALL_ACCESS_SUCCESS:
            return { loading: false, consultants: action.payload };
        case CONSULTANT_ALL_ACCESS_FAIL:
            return { loading: false, error: action.payload };
        case CONSULTANT_ALL_ACCESS_RESET:
            return {}
        default:
            return state;
    }
};
*/

export const consultantGetCDMReducer = (state = { }, action) => {
    switch (action.type) {
        case CONSULTANT_CDM_REQUEST:
            return { loading: true };
        case CONSULTANT_CDM_SUCCESS:
            return { loading: false, success: true, cdm: action.payload };
        case CONSULTANT_CDM_FAIL:
            return { loading: false, error: action.payload };
        case CONSULTANT_CDM_RESET:
            return {}
        default:
            return state;
    }
};

export const consultantSkillsReducer = (state = {}, action) => {
    switch (action.type) {
        case CONSULTANT_SKILLS_REQUEST:
            return { loading: true };
        case CONSULTANT_SKILLS_SUCCESS:
            return { loading: false, skills: action.payload };
        case CONSULTANT_SKILLS_FAIL:
            return { loading: false, error: action.payload };
        case CONSULTANT_SKILLS_RESET:
            return {}
        default:
            return state;
    }
};

export const consultantAllSkillsReducer = (state = {}, action) => {
    switch (action.type) {
        case CONSULTANT_ALL_SKILLS_REQUEST:
            return { loading: true };
        case CONSULTANT_ALL_SKILLS_SUCCESS:
            return { loading: false, skills: action.payload };
        case CONSULTANT_ALL_SKILLS_FAIL:
            return { loading: false, error: action.payload };
        case CONSULTANT_ALL_SKILLS_RESET:
            return {}
        default:
            return state;
    }
};

export const consultantAllStaffsReducer = (state = {}, action) => {
    switch (action.type) {
        case CONSULTANT_ALL_STAFF_REQUEST:
            return { loading: true };
        case CONSULTANT_ALL_STAFF_SUCCESS:
            return { loading: false, staffings: action.payload };
        case CONSULTANT_ALL_STAFF_FAIL:
            return { loading: false, error: action.payload };
        case CONSULTANT_ALL_STAFF_RESET:
            return {}
        default:
            return state;
    }
};

export const consultantAddSkillReducer = (state = {}, action) => {
    switch (action.type) {
        case CONSULTANT_ADD_SKILL_REQUEST:
            return { loading: true };
        case CONSULTANT_ADD_SKILL_SUCCESS:
            return { loading: false, success: true };
        case CONSULTANT_ADD_SKILL_FAIL:
            return { loading: false, success: false, error: action.payload };
        case CONSULTANT_ADD_SKILL_RESET:
            return {}
        default:
            return state;
    }
};

export const consultantDeleteSkillReducer = (state = {}, action) => {
    switch (action.type) {
        case CONSULTANT_DELETE_SKILL_REQUEST:
            return { loading: true };
        case CONSULTANT_DELETE_SKILL_SUCCESS:
            return { loading: false, success: true };
        case CONSULTANT_DELETE_SKILL_FAIL:
            return { loading: false, success: false, error: action.payload };
        case CONSULTANT_DELETE_SKILL_RESET:
            return {}
        default:
            return state;
    }
};

export const consultantUpdateSkillReducer = (state = {}, action) => {
    switch (action.type) {
        case CONSULTANT_UPDATE_SKILL_REQUEST:
            return { loading: true };
        case CONSULTANT_UPDATE_SKILL_SUCCESS:
            return { loading: false, success: true };
        case CONSULTANT_UPDATE_SKILL_FAIL:
            return { loading: false, success: false, error: action.payload };
        case CONSULTANT_UPDATE_SKILL_RESET:
            return {}
        default:
            return state;
    }
};