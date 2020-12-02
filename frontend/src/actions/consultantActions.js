import {
    CONSULTANTS_MY_DETAILS_FAIL,
    CONSULTANTS_MY_DETAILS_REQUEST,
    CONSULTANTS_MY_DETAILS_SUCCESS
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