import axios from 'axios';
import { CONSULTANTS_MY_DETAILS_RESET, CONSULTANT_MY_RESET } from '../constants/consultantConstants';
import { PXX_LIST_RESET, PXX_MY_TO_EDIT_RESET, PXX_UPDATE_RESET } from '../constants/pxxConstants';
import { 

    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
    USER_DELETE_REQUEST, 
    USER_DELETE_SUCCESS,
    USER_DELETE_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS, 
    USER_DETAILS_FAIL, 
    USER_LIST_REQUEST,
    USER_LIST_SUCCESS,
    USER_LIST_FAIL, 
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_UPDATE_PROFILE_FAIL,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAIL,
    USER_REGISTER_RESET,
    USER_REDIRECT_AZ_REQUEST,
    USER_REDIRECT_AZ_SUCCESS,
    USER_REDIRECT_AZ_FAIL
} from "../constants/userConstants";


//export const login = (email, password) => async(dispatch) => {
export const login = (type, param) => async (dispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST,
        });

        const config = {
            headers:{
                'Content-type': 'Application/json'
            }
        };

        let data = '';
        if (type === 'LOCAL') {
            // data contains all shared user informations
            data  = await axios.post('/api/users/login', {email: param.email, password: param.password}, config);
        }

        if (type === 'AZ') {
            data = await axios.get(`/api/users/loginAz?code=${param.code}`, config);
        }

        const userInfo = {
            ...data.data,
            accountType: type,
        }

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: userInfo
        });

        localStorage.setItem('userInfo', JSON.stringify(userInfo))

    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const getTransparentNewToken = (information, userInfo) => async (dispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST,
        });
        
        //console.log("information", information);
        const type = 'LOCAL'
        //const { userLogin: { userInfo } } = getState();

        //console.log('userInfo', userInfo);

        const config = {
            headers:{
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data }  = await axios.post('/api/users/renewToken', information, config);

        const userInfoUpdated = {
            ...data,
            accountType: type,
        }

        //console.log("userInfoUpdated", userInfoUpdated);

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: userInfoUpdated
        });

        localStorage.setItem('userInfo', JSON.stringify(userInfoUpdated));

    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const getRedirectAz = () => async(dispatch) => {
    try {
        dispatch({
            type: USER_REDIRECT_AZ_REQUEST,
        });

        const config = {
            headers:{
                'Content-type': 'Application/json'
            }
        };

        // Check if user is configured in app
        const { data } = await axios.get('/api/users/redirectAz', config);

        dispatch({
            type: USER_REDIRECT_AZ_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: USER_REDIRECT_AZ_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const logout = () => (dispatch) => {
    //localStorage.removeItem('userInfo');
    localStorage.clear();
    dispatch({type: USER_LOGOUT});
    dispatch({type: USER_REGISTER_RESET});
    dispatch({type: CONSULTANTS_MY_DETAILS_RESET});
    dispatch({type: CONSULTANT_MY_RESET});
    dispatch({type: PXX_LIST_RESET});
    dispatch({type: PXX_MY_TO_EDIT_RESET});
    dispatch({type: PXX_UPDATE_RESET});
};

export const register = (name, email, password) => async(dispatch) => {
    try {
        dispatch({
            type: USER_REGISTER_REQUEST,
        });

        const config = {
            headers:{
                'Content-type': 'Application/json'
            }
        };

        // data contains all shared user informations
        const { data } = await axios.post('/api/users', {name, email, password}, config);

        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data
        });

        /*
        // we also want to inform user is logged
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        });
        localStorage.setItem('userInfo', JSON.stringify(data))
        */


    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const getUserDetails = (id) => async(dispatch, getState) => {
    try {
        dispatch({
            type: USER_DETAILS_REQUEST,
        });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers:{
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        // data contains all shared user informations
        const { data } = await axios.get(`/api/users/${id}`, config);

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const updateUserProfile = (user) => async(dispatch, getState) => {
    try {

        dispatch({
            type: USER_UPDATE_PROFILE_REQUEST,
        });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers:{
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        // data contains all shared user informations
        const { data } = await axios.put(`/api/users/profile`, user, config);

        dispatch({
            type: USER_UPDATE_PROFILE_SUCCESS,
            payload: data
        });

        // dispatch({
        //     type: USER_LOGIN_SUCCESS,
        //     payload: data,
        // });

        // dispatch({
        //     type: USER_DETAILS_SUCCESS,
        //     payload: data,
        // });

        //localStorage.setItem('userInfo', JSON.stringify(data));

    } catch (error) {
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const listUsers = (practice='', keyword='', pageNumber='', pageSize='15') => async(dispatch, getState) => {
    try {

        dispatch({
            type: USER_LIST_REQUEST,
        });

        const { userLogin: { userInfo } } = getState();
        //const userPractice = userInfo.consultantProfil.practice;

        const config = {
            headers:{
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        //const { data } = await axios.get(`/api/users`, config);
        const { data } = await axios.get(`/api/users?practice=${practice}&keyword=${keyword}&pageNumber=${pageNumber}&pageSize=${pageSize}`, config);

        dispatch({
            type: USER_LIST_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: USER_LIST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};


export const deleteUser = (id) => async(dispatch, getState) => {
    try {

        dispatch({
            type: USER_DELETE_REQUEST,
        });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers:{
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        await axios.delete(`/api/users/${id}`, config);

        dispatch({
            type: USER_DELETE_SUCCESS,
        });

    } catch (error) {
        dispatch({
            type: USER_DELETE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};


export const updateUser = (user) => async(dispatch, getState) => {
    try {

        dispatch({
            type: USER_UPDATE_REQUEST,
        });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers:{
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        await axios.put(`/api/users/${user._id}`, user, config);

        dispatch({ type: USER_UPDATE_SUCCESS });

    } catch (error) {
        dispatch({
            type: USER_UPDATE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};