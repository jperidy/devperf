import axios from 'axios';
import { 
    CLIENT_ALL_FAIL, 
    CLIENT_ALL_REQUEST, 
    CLIENT_ALL_SUCCESS, 
    CLIENT_CREATE_FAIL, 
    CLIENT_CREATE_REQUEST,
    CLIENT_CREATE_SUCCESS,
    CLIENT_DELETE_FAIL,
    CLIENT_DELETE_REQUEST,
    CLIENT_DELETE_SUCCESS,
    CLIENT_UPDATE_FAIL,
    CLIENT_UPDATE_REQUEST,
    CLIENT_UPDATE_SUCCESS
} from '../constants/clientConstants';

export const getAllClients = (name='', pageNumber='', pageSize='') => async (dispatch, getState) => {

    try {

        dispatch({ type: CLIENT_ALL_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/clients?clientName=${name}&pageNumber=${pageNumber}&pageSize=${pageSize}`, config);
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
                'Content-type': 'Application/json',
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

export const updateAClient = (clients) => async (dispatch, getState) => {

    try {

        dispatch({ type: CLIENT_UPDATE_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.put(`/api/clients`, clients, config);
        dispatch({ type: CLIENT_UPDATE_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: CLIENT_UPDATE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const deleteAClient = (clientsId) => async (dispatch, getState) => {

    try {

        dispatch({ type: CLIENT_DELETE_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.delete(`/api/clients/${clientsId}`, config);
        dispatch({ type: CLIENT_DELETE_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: CLIENT_DELETE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};