import axios from 'axios';
import { 
    ACCESS_LIST_FAIL, 
    ACCESS_LIST_REQUEST, 
    ACCESS_LIST_SUCCESS 
} from '../constants/accessConstants';

export const getAllAccess = () => async (dispatch, getState) => {

    try {

        dispatch({ type: ACCESS_LIST_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/access`, config);
        dispatch({ type: ACCESS_LIST_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: ACCESS_LIST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};