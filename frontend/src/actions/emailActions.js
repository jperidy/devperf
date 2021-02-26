import axios from 'axios';
import { 
    EMAIL_CONTACTS_LIST_FAIL, 
    EMAIL_CONTACTS_LIST_REQUEST, 
    EMAIL_CONTACTS_LIST_SUCCESS, 
    EMAIL_SEND_DECISION_FAIL, 
    EMAIL_SEND_DECISION_REQUEST, 
    EMAIL_SEND_DECISION_SUCCESS
} from '../constants/emailConstants';

export const getContactsList = () => async (dispatch, getState) => {

    try {

        dispatch({ type: EMAIL_CONTACTS_LIST_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers:{
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/emails/contacts`, config);

        dispatch({ type: EMAIL_CONTACTS_LIST_SUCCESS, payload: data });


    } catch (error) {
        dispatch({
            type: EMAIL_CONTACTS_LIST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const sendDecisionEmail = (email, name) => async (dispatch, getState) => {

    try {

        dispatch({ type: EMAIL_SEND_DECISION_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers:{
                //'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/emails/decision?email=${email}&name=${name}`, config);

        dispatch({ type: EMAIL_SEND_DECISION_SUCCESS, payload: data });


    } catch (error) {
        dispatch({
            type: EMAIL_SEND_DECISION_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};