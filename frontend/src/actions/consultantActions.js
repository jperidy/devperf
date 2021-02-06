import axios from 'axios';
import {
    CONSULTANTS_ALL_ADMIN_DETAILS_FAIL,
    CONSULTANTS_ALL_ADMIN_DETAILS_REQUEST,
    CONSULTANTS_ALL_ADMIN_DETAILS_SUCCESS,
    CONSULTANTS_MY_DETAILS_FAIL,
    CONSULTANTS_MY_DETAILS_FOCUS,
    CONSULTANTS_MY_DETAILS_REQUEST,
    CONSULTANTS_MY_DETAILS_SUCCESS,
    CONSULTANT_MY_FAIL,
    CONSULTANT_MY_REQUEST,
    CONSULTANT_MY_SUCCESS,
    CONSULTANT_MY_UPDATE_FAIL,
    CONSULTANT_MY_UPDATE_REQUEST,
    CONSULTANT_MY_UPDATE_SUCCESS,
    CONSULTANT_CREATE_REQUEST,
    CONSULTANT_CREATE_SUCCESS,
    CONSULTANT_CREATE_FAIL,
    CONSULTANT_CDM_LIST_REQUEST,
    CONSULTANT_CDM_LIST_SUCCESS,
    CONSULTANT_CDM_LIST_FAIL,
    CONSULTANT_PRACTICE_LIST_REQUEST,
    CONSULTANT_PRACTICE_LIST_FAIL,
    CONSULTANT_PRACTICE_LIST_SUCCESS,
    CONSULTANT_DELETE_REQUEST,
    CONSULTANT_DELETE_FAIL,
    CONSULTANT_DELETE_SUCCESS,
    CONSULTANT_UPDATE_COMMENT_REQUEST,
    CONSULTANT_UPDATE_COMMENT_SUCCESS,
    CONSULTANT_UPDATE_COMMENT_FAIL,
    //CONSULTANT_ALL_ACCESS_REQUEST,
    //CONSULTANT_ALL_ACCESS_SUCCESS,
    //CONSULTANT_ALL_ACCESS_FAIL,
    CONSULTANT_ALL_SKILLS_REQUEST,
    CONSULTANT_ALL_SKILLS_SUCCESS,
    CONSULTANT_ALL_SKILLS_FAIL,
    CONSULTANT_ADD_SKILL_REQUEST,
    CONSULTANT_ADD_SKILL_SUCCESS,
    CONSULTANT_ADD_SKILL_FAIL,
    CONSULTANT_DELETE_SKILL_REQUEST,
    CONSULTANT_DELETE_SKILL_FAIL,
    CONSULTANT_UPDATE_SKILL_REQUEST,
    CONSULTANT_UPDATE_SKILL_FAIL,
    CONSULTANT_UPDATE_SKILL_SUCCESS,
    CONSULTANT_ALL_STAFF_REQUEST,
    CONSULTANT_ALL_STAFF_SUCCESS,
    CONSULTANT_ALL_STAFF_FAIL,
    CONSULTANT_DELETE_SKILL_SUCCESS,
    CONSULTANT_SKILLS_REQUEST,
    CONSULTANT_SKILLS_FAIL,
    CONSULTANT_SKILLS_SUCCESS,
    CONSULTANT_CDM_REQUEST,
    CONSULTANT_CDM_SUCCESS,
    CONSULTANT_CDM_FAIL
} from '../constants/consultantConstants';

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

export const setConsultantFocus = (focus) => async(dispatch) => {
    dispatch({type: CONSULTANTS_MY_DETAILS_FOCUS, payload: focus});
}

export const getMyConsultant = (consultantId) => async (dispatch, getState) => {

    try {

        dispatch({ type: CONSULTANT_MY_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/consultants/${consultantId}`, config);

        dispatch({ type: CONSULTANT_MY_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: CONSULTANT_MY_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};


export const updateMyConsultant = (consultant) => async (dispatch, getState) => {

    try {

        dispatch({ type: CONSULTANT_MY_UPDATE_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.put(`/api/consultants/${consultant._id}`, consultant, config);
        if (!data) {
            throw new Error('Error: your modification is not saved')
        }

        dispatch({ type: CONSULTANT_MY_UPDATE_SUCCESS });

    } catch (error) {
        dispatch({
            type: CONSULTANT_MY_UPDATE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const createConsultant = (consultant) => async (dispatch, getState) => {

    try {

        dispatch({ type: CONSULTANT_CREATE_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.post('/api/consultants', consultant, config);

        dispatch({ type: CONSULTANT_CREATE_SUCCESS, payload: data });

} catch (error) {
    dispatch({
        type: CONSULTANT_CREATE_FAIL,
        payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
    });
}
};

export const deleteConsultant = (consultantId) => async (dispatch, getState) => {

    try {

        dispatch({ type: CONSULTANT_DELETE_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        await axios.delete(`/api/consultants/${consultantId}`, config);

        dispatch({ type: CONSULTANT_DELETE_SUCCESS });

} catch (error) {
    dispatch({
        type: CONSULTANT_DELETE_FAIL,
        payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
    });
}
};

export const getAllCDM = (practice) => async (dispatch, getState) => {

    try {

        dispatch({ type: CONSULTANT_CDM_LIST_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/consultants/cdm/${practice}`, config);

        dispatch({ type: CONSULTANT_CDM_LIST_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: CONSULTANT_CDM_LIST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const getAllPractice = () => async (dispatch, getState) => {

    try {

        dispatch({ type: CONSULTANT_PRACTICE_LIST_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/consultants/practicelist`, config);

        dispatch({ type: CONSULTANT_PRACTICE_LIST_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: CONSULTANT_PRACTICE_LIST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const getAllStaffs = (consultantId) => async (dispatch, getState) => {

    try {

        dispatch({ type: CONSULTANT_ALL_STAFF_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/consultants/staffings?consultantId=${consultantId}`, config);

        dispatch({ type: CONSULTANT_ALL_STAFF_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: CONSULTANT_ALL_STAFF_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const updateComment = (consultantId, commentText) => async(dispatch, getState) => {
    try {

        dispatch({
            type: CONSULTANT_UPDATE_COMMENT_REQUEST,
        });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers:{
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };
        await axios.put(`/api/consultants/comment/${consultantId}`, {commentText}, config);

        dispatch({ type: CONSULTANT_UPDATE_COMMENT_SUCCESS });

    } catch (error) {
        dispatch({
            type: CONSULTANT_UPDATE_COMMENT_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const getAllMyAdminConsultants = (keyword = '', pageNumber = '', pageSize = '15') => async (dispatch, getState) => {

    try {

        dispatch({ type: CONSULTANTS_ALL_ADMIN_DETAILS_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/consultants/admin/consultants?keyword=${keyword}&pageNumber=${pageNumber}&pageSize=${pageSize}`, config);
        dispatch({ type: CONSULTANTS_ALL_ADMIN_DETAILS_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: CONSULTANTS_ALL_ADMIN_DETAILS_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

/*
export const getAllConsultantByAccess = () => async (dispatch, getState) => {

    try {

        dispatch({ type: CONSULTANT_ALL_ACCESS_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/consultants/admin/consultants?keyword=&pageNumber=&pageSize=`, config);

        dispatch({ type: CONSULTANT_ALL_ACCESS_SUCCESS, payload: data.consultants });

    } catch (error) {
        dispatch({
            type: CONSULTANT_ALL_ACCESS_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};
*/

export const getConsultantCdm = (consultantId) => async (dispatch, getState) => {

    try {

        dispatch({ type: CONSULTANT_CDM_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/consultants/${consultantId}/cdm`, config);

        dispatch({ type: CONSULTANT_CDM_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: CONSULTANT_CDM_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const getConsultantSkills = (consultantId) => async (dispatch, getState) => {

    try {

        dispatch({ type: CONSULTANT_SKILLS_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/consultants/${consultantId}/skill`, config);

        dispatch({ type: CONSULTANT_SKILLS_SUCCESS, payload: data.quality });

    } catch (error) {
        dispatch({
            type: CONSULTANT_SKILLS_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const getAllConsultantSkills = () => async (dispatch, getState) => {

    try {

        dispatch({ type: CONSULTANT_ALL_SKILLS_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/consultants/skills`, config);

        dispatch({ type: CONSULTANT_ALL_SKILLS_SUCCESS, payload: data.skills });

    } catch (error) {
        dispatch({
            type: CONSULTANT_ALL_SKILLS_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const consultantAddASkill = (consultantId, skillId, level) => async (dispatch, getState) => {

    //console.log("consultantId", consultantId, 'skillId', skillId, 'level', level);

    try {
        const skill = {
            skill: skillId,
            level: level
        }

        dispatch({ type: CONSULTANT_ADD_SKILL_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        await axios.put(`/api/consultants/${consultantId}/skill`, skill, config);

        dispatch({ type: CONSULTANT_ADD_SKILL_SUCCESS });

    } catch (error) {
        dispatch({
            type: CONSULTANT_ADD_SKILL_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const consultantDeleteSkill = (consultantId, skillId) => async (dispatch, getState) => {

    //console.log("consultantId", consultantId, 'skillId', skillId);

    try {

        dispatch({ type: CONSULTANT_DELETE_SKILL_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        await axios.delete(`/api/consultants/${consultantId}/skill/${skillId}`, config);

        dispatch({ type: CONSULTANT_DELETE_SKILL_SUCCESS });

    } catch (error) {
        dispatch({
            type: CONSULTANT_DELETE_SKILL_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const consultantUpdateASkillLevel = (consultantId, skillId, level) => async (dispatch, getState) => {

    try {

        dispatch({ type: CONSULTANT_UPDATE_SKILL_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        await axios.put(`/api/consultants/${consultantId}/skill/${skillId}`, { level }, config);

        dispatch({ type: CONSULTANT_UPDATE_SKILL_SUCCESS });

    } catch (error) {
        dispatch({
            type: CONSULTANT_UPDATE_SKILL_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};