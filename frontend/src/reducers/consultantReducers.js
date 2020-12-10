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
    CONSULTANTS_ALL_ADMIN_DETAILS_RESET
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

export const consultantMyReducer = (state = { loading: true, consultant: {} }, action) => {
    switch (action.type) {
        case CONSULTANT_MY_REQUEST:
            return { ...state, loading: true };
        case CONSULTANT_MY_SUCCESS:
            return { loading: false, consultant: action.payload };
        case CONSULTANT_MY_FAIL:
            return { loading: false, error: action.payload };
        case CONSULTANT_MY_RESET:
            return { loading: true, consultant: {} }
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