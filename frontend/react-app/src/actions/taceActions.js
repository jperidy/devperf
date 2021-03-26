import axios from 'axios';
import { 
    TACE_CREATE_FAIL,
    TACE_CREATE_REQUEST, 
    TACE_CREATE_SUCCESS, 
} from '../constants/taceConstants';

export const createTaceData = (taceData) => async(dispatch, getState) => {

    try {
        dispatch({
            type: TACE_CREATE_REQUEST,
        });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers:{
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.post('/api/tace', taceData, config);

        dispatch({
            type: TACE_CREATE_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: TACE_CREATE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};