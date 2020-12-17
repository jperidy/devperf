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
    CONSULTANTS_ALL_ADMIN_DETAILS_FOCUS,
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
    CONSULTANT_UPDATE_COMMENT_RESET
} from '../constants/consultantConstants';

export const consultantsMyListReducer = (state = {
    loading: true, 
    consultantsMy: [
        {
            name: '',
            matricule: '',
            arrival: '',
            leaving: '',
            seriority: '',
            comment: ''
        }],
    focus: 0
}, action) => {
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
            return { loading: true, consultantsMy: [
                                {
                                    name: '',
                                    matricule: '',
                                    arrival: '',
                                    leaving: '',
                                    seriority: '',
                                    comment: '' 
                                }], focus: 0 }
        default:
            return state;
    }
};

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