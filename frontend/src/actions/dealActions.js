import axios from 'axios';
import { 
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