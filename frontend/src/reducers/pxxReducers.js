import {
    PXX_LIST_REQUEST,
    PXX_LIST_SUCCESS,
    PXX_LIST_FAIL,
    PXX_LIST_RESET,
    PXX_MY_TO_EDIT_REQUEST,
    PXX_MY_TO_EDIT_SUCCESS,
    PXX_MY_TO_EDIT_FAIL,
    PXX_MY_TO_EDIT_RESET
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