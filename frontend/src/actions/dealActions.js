import axios from 'axios';
import { 
    DEAL_ALL_LIST_FAIL,
    DEAL_ALL_LIST_REQUEST,
    DEAL_ALL_LIST_SUCCESS,
    DEAL_CREATE_FAIL, 
    DEAL_CREATE_REQUEST, 
    DEAL_CREATE_SUCCESS, 
    DEAL_DELETE_FAIL, 
    DEAL_DELETE_REQUEST,
    DEAL_DELETE_SUCCESS,
    DEAL_EDIT_FAIL,
    DEAL_EDIT_REQUEST,
    DEAL_EDIT_SUCCESS,
    DEAL_OLD_FAIL,
    DEAL_OLD_REQUEST,
    DEAL_OLD_SUCCESS,
    DEAL_UPDATE_FAIL,
    DEAL_UPDATE_REQUEST,
    DEAL_UPDATE_SUCCESS
} from '../constants/dealConstants';


export const createDeal = (deal) => async (dispatch, getState) => {

    try {

        dispatch({ type: DEAL_CREATE_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.post(`/api/deals`, deal, config);

       dispatch({ type: DEAL_CREATE_SUCCESS, payload: data._id });

    } catch (error) {
        dispatch({
            type: DEAL_CREATE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const updateDeal = (dealId, deal) => async (dispatch, getState) => {

    try {

        dispatch({ type: DEAL_UPDATE_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        await axios.put(`/api/deals/${dealId}`, deal, config);

       dispatch({ type: DEAL_UPDATE_SUCCESS });

    } catch (error) {
        dispatch({
            type: DEAL_UPDATE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const getAllDeals = (keyword, pageNumber = 1, pageSize = 20, state = '') => async (dispatch, getState) => {

    try {

        dispatch({ type: DEAL_ALL_LIST_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/deals?title=${keyword.title}&company=${keyword.company}&contact=${keyword.contact}&status=${keyword.status}&request=${keyword.request}&pageNumber=${pageNumber}&pageSize=${pageSize}$state=${state}&filterMy=${keyword.filterMy}&staff=${keyword.staff}`, config);

       dispatch({ type: DEAL_ALL_LIST_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: DEAL_ALL_LIST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const deleteDeal = (id) => async (dispatch, getState) => {

    try {

        dispatch({ type: DEAL_DELETE_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        //await axios.delete(`/api/deals?id=${id}`, config);
        await axios.delete(`/api/deals/${id}`, config);

       dispatch({ type: DEAL_DELETE_SUCCESS });

    } catch (error) {
        dispatch({
            type: DEAL_DELETE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const getDealToEdit = (id) => async (dispatch, getState) => {

    try {

        dispatch({ type: DEAL_EDIT_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/deals/${id}`, config);

       dispatch({ type: DEAL_EDIT_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: DEAL_EDIT_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const getOldDeals = (consultantId) => async (dispatch, getState) => {

    try {

        dispatch({ type: DEAL_OLD_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/deals/old?consultantId=${consultantId}`, config);

       dispatch({ type: DEAL_OLD_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: DEAL_OLD_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};