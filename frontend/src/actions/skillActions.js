import axios from 'axios';
import {
    SKILL_LIST_REQUEST,
    SKILL_LIST_SUCCESS,
    SKILL_LIST_FAIL,
    SKILL_DELETE_REQUEST,
    SKILL_DELETE_FAIL,
    SKILL_DELETE_SUCCESS,
    SKILL_CREATE_REQUEST,
    SKILL_CREATE_SUCCESS,
    SKILL_CREATE_FAIL
 } from '../constants/skillsConstants';

export const getAllSkills = (category = '', name = '', pageNumber = '', pageSize = '15') => async (dispatch, getState) => {

    try {

        dispatch({ type: SKILL_LIST_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/skills?category=${category}&name=${name}&pageNumber=${pageNumber}&pageSize=${pageSize}`, config);
        dispatch({ type: SKILL_LIST_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: SKILL_LIST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const deleteSkill = (skillId) => async (dispatch, getState) => {
    
    // TO FINISH : if delete a skill, you need to delete on all consultant associated profils
    
    try {

        dispatch({ type: SKILL_DELETE_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.delete(`/api/skills/${skillId}`, config);
        dispatch({ type: SKILL_DELETE_SUCCESS });

    } catch (error) {
        dispatch({
            type: SKILL_DELETE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
}

export const createSkills = (skill) => async (dispatch, getState) => {

    try {

        dispatch({ type: SKILL_CREATE_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.post('/api/skills', skill, config);
        dispatch({ type: SKILL_CREATE_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: SKILL_CREATE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};