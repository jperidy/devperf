import { 
    EMAIL_CONTACTS_LIST_FAIL, 
    EMAIL_CONTACTS_LIST_REQUEST, 
    EMAIL_CONTACTS_LIST_RESET, 
    EMAIL_CONTACTS_LIST_SUCCESS 
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