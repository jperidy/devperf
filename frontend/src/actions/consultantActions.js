import {
    CONSULTANTS_MY_DETAILS_FAIL,
    CONSULTANTS_MY_DETAILS_FOCUS,
    CONSULTANTS_MY_DETAILS_REQUEST,
    CONSULTANTS_MY_DETAILS_SUCCESS,
    CONSULTANT_MY_FAIL,
    CONSULTANT_MY_REQUEST,
    CONSULTANT_MY_SUCCESS
} from '../constants/consultantConstants';

const axios = require('axios');

export const getAllMyConsultants = () => async (dispatch, getState) => {

    try {

        dispatch({ type: CONSULTANTS_MY_DETAILS_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get('/api/consultants', config);        

        dispatch({ type: CONSULTANTS_MY_DETAILS_SUCCESS, payload: data });

} catch (error) {
    dispatch({
        type: CONSULTANTS_MY_DETAILS_FAIL,
        payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
    });
}
};

export const setConsultantFocus = (focus) => async(dispatch) => {
    dispatch({type: CONSULTANTS_MY_DETAILS_FOCUS, payload: focus});
}

export const getMyConsultant = (consultantId) => async (dispatch, getState) => {

    try {

        dispatch({ type: CONSULTANT_MY_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/consultants/${consultantId}`, config);
        /*
        const data = { 
            "isCDM": true, "isAdmin": false, 
            "comment": "Please enter your comment", 
            "name": "userCDM1000", 
            "matricule": "matricule1000", 
            "email": "userCDM1000@mail.com", 
            "arrival": "12/12/2012", 
            "leaving": "", 
            "seniority": ""
        }
        */

        dispatch({ type: CONSULTANT_MY_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: CONSULTANT_MY_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};