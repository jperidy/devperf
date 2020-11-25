import {
    PXX_LIST_REQUEST,
    PXX_LIST_SUCCESS,
    PXX_LIST_FAIL,
    PXX_LIST_RESET
} from '../constants/pxxConstants';

export const pxxListReducer = (state={ pxxs: { pxxMonthInformation: [], pxxUserList: [] }}, action) => {
    switch(action.type) {
        case PXX_LIST_REQUEST:
            return { loading: true, pxxs: {} };
        case PXX_LIST_SUCCESS:
            return { loading: false, pxxs: action.payload };
        case PXX_LIST_FAIL:
            return { loading: false, error: action.payload };
        case PXX_LIST_RESET:
            return { pxxs: { pxxMonthInformation: [], pxxUserList: [] }};
        default:
            return state ;
    }
};