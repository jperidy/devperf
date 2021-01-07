import axios from 'axios';
import { 
    DEAL_ALL_LIST_FAIL,
    DEAL_ALL_LIST_REQUEST,
    DEAL_ALL_LIST_SUCCESS,
    DEAL_CREATE_FAIL, 
    DEAL_CREATE_REQUEST, 
    DEAL_CREATE_SUCCESS 
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

        await axios.post(`/api/deals`, deal, config);

       dispatch({ type: DEAL_CREATE_SUCCESS });

    } catch (error) {
        dispatch({
            type: DEAL_CREATE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const getAllDeals = (keyword = { title:'', mainPractice:'', othersPractices:'', client:'', company:'', status:'', request:'' }, pageNumber = 1, pageSize = 20) => async (dispatch, getState) => {

    try {

        dispatch({ type: DEAL_ALL_LIST_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/deals?mainPractice=${keyword.mainPractice}&othersPractices=${keyword.othersPractices}&title=${keyword.title}&company=${keyword.company}&client=${keyword.client}&status=${keyword.status}&request=${keyword.request}&pageNumber=${pageNumber}&pageSize=${pageSize}`, config);

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