import {
    PXX_LIST_REQUEST,
    PXX_LIST_SUCCESS,
    PXX_LIST_FAIL,
    PXX_LIST_RESET,
    PXX_MY_TO_EDIT_REQUEST,
    PXX_MY_TO_EDIT_SUCCESS,
    PXX_MY_TO_EDIT_FAIL,
    PXX_MY_TO_EDIT_RESET,
    PXX_UPDATE_REQUEST,
    PXX_UPDATE_SUCCESS,
    PXX_UPDATE_FAIL,
    PXX_UPDATE_RESET,
    PXX_TACE_REQUEST,
    PXX_TACE_SUCCESS,
    PXX_TACE_FAIL,
    PXX_TACE_RESET,
    PXX_AVAILABILITIES_REQUEST,
    PXX_AVAILABILITIES_SUCCESS,
    PXX_AVAILABILITIES_FAIL,
    PXX_AVAILABILITIES_RESET,
    PXX_ALL_REQUEST,
    PXX_ALL_SUCCESS,
    PXX_ALL_FAIL,
    PXX_ALL_RESET
} from '../constants/pxxConstants';

export const pxxMyToEditReducer = (state= { pxx: [] }, action) => {
    switch(action.type) {
        case PXX_MY_TO_EDIT_REQUEST:
            return { loading: true };
        case PXX_MY_TO_EDIT_SUCCESS:
            return { loading: false, pxx: action.payload };
        case PXX_MY_TO_EDIT_FAIL:
            return { loading: false, error: action.payload };
        case PXX_MY_TO_EDIT_RESET:
            return { pxx: [] };
        default:
            return state ;
    }
};

export const pxxUpdateReducer = (state= { }, action) => {
    switch(action.type) {
        case PXX_UPDATE_REQUEST:
            return { loading: true };
        case PXX_UPDATE_SUCCESS:
            return { loading: false, success: true };
        case PXX_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        case PXX_UPDATE_RESET:
            return {};
        default:
            return state ;
    }
};

export const pxxTACEReducer = (state= {}, action) => {
    switch(action.type) {
        case PXX_TACE_REQUEST:
            return { loading: true, success: false };
        case PXX_TACE_SUCCESS:
            return { loading: false, success: true, tace: action.payload };
        case PXX_TACE_FAIL:
            return { loading: false, error: action.payload };
        case PXX_TACE_RESET:
            return {};
        default:
            return state ;
    }
};

export const pxxAvailabilitiesReducer = (state= {}, action) => {
    switch(action.type) {
        case PXX_AVAILABILITIES_REQUEST:
            return { loading: true, success: false };
        case PXX_AVAILABILITIES_SUCCESS:
            return { loading: false, success: true, availabilities: action.payload };
        case PXX_AVAILABILITIES_FAIL:
            return { loading: false, error: action.payload };
        case PXX_AVAILABILITIES_RESET:
            return {};
        default:
            return state ;
    }
};

export const pxxAllListReducer = (state= {}, action) => {
    switch(action.type) {
        case PXX_ALL_REQUEST:
            return { loading: true, success: false };
        case PXX_ALL_SUCCESS:
            return { 
                loading: false, 
                success: true, 
                pxxs: action.payload.pxxs,
                pages: action.payload.pages,
                page: action.payload.page,
                count: action.payload.count
            };
        case PXX_ALL_FAIL:
            return { loading: false, error: action.payload };
        case PXX_ALL_RESET:
            return {};
        default:
            return state ;
    }
};



// TO DELETE //

export const pxxListReducer = (state= { pxxs: { pxxMonthInformation: [], pxxUserList: [] } }, action) => {
    switch(action.type) {
        case PXX_LIST_REQUEST:
            return { loading: true, pxxs: {} };
        case PXX_LIST_SUCCESS:
            return { loading: false, pxxs: action.payload };
        case PXX_LIST_FAIL:
            return { loading: false, error: action.payload };
        case PXX_LIST_RESET:
            return { pxxs: { pxxMonthInformation: [], pxxUserList: [] } };
        default:
            return state ;
    }
};