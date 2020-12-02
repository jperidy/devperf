import {
    CONSULTANTS_MY_DETAILS_REQUEST,
    CONSULTANTS_MY_DETAILS_SUCCESS,
    CONSULTANTS_MY_DETAILS_FAIL,
    CONSULTANTS_MY_DETAILS_RESET
} from '../constants/consultantConstants';

export const consultantsMyListReducer = (state = { loading: true, consultantsMy: [
                                                    {
                                                        name: '',
                                                        matricule: '',
                                                        arrival: '',
                                                        leaving: '',
                                                        seriority: '',
                                                        comment: '' 
                                                    }] }, action) => {
    switch (action.type) {
        case CONSULTANTS_MY_DETAILS_REQUEST:
            return { ...state, loading: true };
        case CONSULTANTS_MY_DETAILS_SUCCESS:
            return { loading: false, consultantsMy: action.payload };
        case CONSULTANTS_MY_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        case CONSULTANTS_MY_DETAILS_RESET:
            return { loading: true, consultantsMy: [
                                {
                                    name: '',
                                    matricule: '',
                                    arrival: '',
                                    leaving: '',
                                    seriority: '',
                                    comment: '' 
                                }] }
        default:
            return state;
    }
};