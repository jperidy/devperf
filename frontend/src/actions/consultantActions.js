import axios from 'axios';
import {
    CONSULTANTS_ALL_ADMIN_DETAILS_FAIL,
    CONSULTANTS_ALL_ADMIN_DETAILS_REQUEST,
    CONSULTANTS_ALL_ADMIN_DETAILS_SUCCESS,
    CONSULTANTS_MY_DETAILS_FAIL,
    CONSULTANTS_MY_DETAILS_FOCUS,
    CONSULTANTS_MY_DETAILS_REQUEST,
    CONSULTANTS_MY_DETAILS_SUCCESS,
    CONSULTANT_MY_FAIL,
    CONSULTANT_MY_REQUEST,
    CONSULTANT_MY_SUCCESS,
    CONSULTANT_MY_UPDATE_FAIL,
    CONSULTANT_MY_UPDATE_REQUEST,
    CONSULTANT_MY_UPDATE_SUCCESS,
    CONSULTANT_CREATE_REQUEST,
    CONSULTANT_CREATE_SUCCESS,
    CONSULTANT_CREATE_FAIL,
    CONSULTANT_CDM_LIST_REQUEST,
    CONSULTANT_CDM_LIST_SUCCESS,
    CONSULTANT_CDM_LIST_FAIL
} from '../constants/consultantConstants';


export const getAllMyAdminConsultants = () => async (dispatch, getState) => {

    try {

        dispatch({ type: CONSULTANTS_ALL_ADMIN_DETAILS_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get('/api/consultants/practice', config);        
        dispatch({ type: CONSULTANTS_ALL_ADMIN_DETAILS_SUCCESS, payload: data });

} catch (error) {
    dispatch({
        type: CONSULTANTS_ALL_ADMIN_DETAILS_FAIL,
        payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
    });
}
};

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


export const updateMyConsultant = (consultant) => async (dispatch, getState) => {

    try {

        dispatch({ type: CONSULTANT_MY_UPDATE_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.put(`/api/consultants/${consultant._id}`, consultant, config);
        if (!data) {
            throw new Error('Error: your modification is not saved')
        }

        dispatch({ type: CONSULTANT_MY_UPDATE_SUCCESS });

    } catch (error) {
        dispatch({
            type: CONSULTANT_MY_UPDATE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const createConsultant = (consultant) => async (dispatch, getState) => {

    try {

        dispatch({ type: CONSULTANT_CREATE_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.post('/api/consultants', consultant, config);

        dispatch({ type: CONSULTANT_CREATE_SUCCESS, payload: data });

} catch (error) {
    dispatch({
        type: CONSULTANT_CREATE_FAIL,
        payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
    });
}
};

export const getAllCDM = (practice) => async (dispatch, getState) => {

    try {

        dispatch({ type: CONSULTANT_CDM_LIST_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/consultants/cdm/${practice}`, config);

        dispatch({ type: CONSULTANT_CDM_LIST_SUCCESS, payload: data });

} catch (error) {
    dispatch({
        type: CONSULTANT_CDM_LIST_FAIL,
        payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
    });
}
};