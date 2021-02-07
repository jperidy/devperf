import axios from 'axios';
import { 
    CLIENT_ALL_FAIL, 
    CLIENT_ALL_REQUEST, 
    CLIENT_ALL_SUCCESS, 
    CLIENT_CREATE_FAIL, 
    CLIENT_CREATE_REQUEST,
    CLIENT_CREATE_SUCCESS
} from '../constants/clientConstants';

export const getAllClients = (name) => async (dispatch, getState) => {

    try {

        dispatch({ type: CLIENT_ALL_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/clients?clientName=${name}`, config);
        dispatch({ type: CLIENT_ALL_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: CLIENT_ALL_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const createAClient = (clients) => async (dispatch, getState) => {

    try {

        dispatch({ type: CLIENT_CREATE_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.post(`/api/clients`, clients, config);
        dispatch({ type: CLIENT_CREATE_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: CLIENT_CREATE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};