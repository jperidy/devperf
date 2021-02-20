import { 
    EMAIL_CONTACTS_LIST_FAIL, 
    EMAIL_CONTACTS_LIST_REQUEST, 
    EMAIL_CONTACTS_LIST_RESET, 
    EMAIL_CONTACTS_LIST_SUCCESS, 
    EMAIL_SEND_DECISION_FAIL, 
    EMAIL_SEND_DECISION_REQUEST,
    EMAIL_SEND_DECISION_SUCCESS,
    EMAIL_SEND_DECISION_RESET
} from "../constants/emailConstants";

export const contactsListReducer = (state= { }, action) => {
    switch(action.type) {
        case EMAIL_CONTACTS_LIST_REQUEST:
            return { loading: true };
        case EMAIL_CONTACTS_LIST_SUCCESS:
            return { loading: false, contacts: action.payload };
        case EMAIL_CONTACTS_LIST_FAIL:
            return { loading: false, error: action.payload };
        case EMAIL_CONTACTS_LIST_RESET:
            return { };
        default:
            return state ;
    }
};

export const sendOneEmailReducer = (state= { }, action) => {
    switch(action.type) {
        case EMAIL_SEND_DECISION_REQUEST:
            return { loading: true };
        case EMAIL_SEND_DECISION_SUCCESS:
            return { success:true, loading: false, email: action.payload.email };
        case EMAIL_SEND_DECISION_FAIL:
            return { loading: false, error: action.payload };
        case EMAIL_SEND_DECISION_RESET:
            return { };
        default:
            return state ;
    }
};