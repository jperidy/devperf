import axios from 'axios';
import {
    PXX_LIST_REQUEST,
    PXX_LIST_SUCCESS,
    PXX_LIST_FAIL,
    PXX_MY_TO_EDIT_REQUEST,
    PXX_MY_TO_EDIT_FAIL,
    PXX_MY_TO_EDIT_SUCCESS,
    PXX_UPDATE_REQUEST,
    PXX_UPDATE_SUCCESS,
    PXX_UPDATE_FAIL,
    PXX_TACE_REQUEST,
    PXX_TACE_SUCCESS,
    PXX_TACE_FAIL,
    PXX_AVAILABILITIES_REQUEST,
    PXX_AVAILABILITIES_SUCCESS,
    PXX_AVAILABILITIES_FAIL,
    PXX_ALL_REQUEST,
    PXX_ALL_FAIL,
    PXX_ALL_SUCCESS,
    PXX_IMPORT_MASS_SUCCESS,
    PXX_IMPORT_MASS_FAIL,
    PXX_IMPORT_MASS_REQUEST,
    PXX_IMPORT_LINE_REQUEST,
    PXX_IMPORT_LINE_SUCCESS,
    PXX_IMPORT_LINE_FAIL
} from '../constants/pxxConstants';

export const getMyConsultantPxxToEdit = (consultantId, searchDate, numberOfMonth) => async (dispatch, getState) => {

    try {

        dispatch({ type: PXX_MY_TO_EDIT_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        searchDate.setUTCDate(1);
        const month = searchDate.toISOString().substring(0,10);

        const { data } = await axios.get(`/api/pxx/edit?consultantId=${consultantId}&month=${month}&numberOfMonth=${numberOfMonth}`, config)
        
        /*
        const functionDate = new Date(searchDate);
        functionDate.setDate(1);
        const pxx = [];
        for (let incr = 0; incr < numberOfMonth; incr++){
            
            const transformDate = functionDate.toISOString().substring(0,10);
            const { data } = await axios.get(`/api/pxx/consultantId/${consultantId}/month/${transformDate}`, config);
            pxx.push(data);
            functionDate.setMonth(functionDate.getMonth()+1);
        }
        dispatch({ type: PXX_MY_TO_EDIT_SUCCESS, payload: pxx });
        */

       dispatch({ type: PXX_MY_TO_EDIT_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: PXX_MY_TO_EDIT_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const updatePxx = (pxx) => async (dispatch, getState) => {

    try {

        dispatch({ type: PXX_UPDATE_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        await axios.put(`/api/pxx`, pxx, config);    

        dispatch({ type: PXX_UPDATE_SUCCESS });

    } catch (error) {
        dispatch({
            type: PXX_UPDATE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};


// TO DELETE //

const transformListPxxToDisplay = (pxxData, pxxInfo) => {

    const listConsultant = pxxData.data.map(pxx => (pxx.name));

    // collect unique _id for consultant
    const tampon = []
    for (let incr = listConsultant.length - 1; incr >= 0; incr--) {
        if (tampon.includes(listConsultant[incr]._id)) {
            listConsultant.splice(incr, 1);
        } else {
            tampon.push(listConsultant[incr]._id);
        }
    }

    const listPxx = [];
    for (let incr = 0; incr < listConsultant.length; incr++) {

        let pxx = [];

        pxx.push({
            type: "lineInformation",
            value: listConsultant[incr].name,
            userId: listConsultant[incr]._id,
            information: "consultantName"
        });
        pxx.push({
            type: "lineInformation",
            value: listConsultant[incr].arrival,
            userId: listConsultant[incr]._id,
            information: "consultantArrivalDate"
        });
        pxx.push({
            type: "lineInformation",
            value: listConsultant[incr].leaving,
            userId: listConsultant[incr]._id,
            information: "consultantLeavingDate"
        });
        pxx.push({
            type: "lineInformation",
            value: listConsultant[incr].seniority,
            userId: listConsultant[incr]._id,
            information: "consultantSeniority"
        });

        for (let incrMonth = 0; incrMonth < pxxInfo.data.length; incrMonth++) {

            let val = pxxData.data.filter(x => (x.name._id === listConsultant[incr]._id && x.month._id === pxxInfo.data[incrMonth]._id))[0];
            if (val.length > 1) {
                throw new Error({ message: 'number of value can not be up to 1' })
            }
            pxx.push({
                type: "day",
                value: val.prodDay,
                userId: listConsultant[incr]._id,
                pxxId: pxxInfo.data[incrMonth]._id,
                information: 'productionDay'
            });
            pxx.push({
                type: "day",
                value: val.notProdDay,
                userId: listConsultant[incr]._id,
                pxxId: pxxInfo.data[incrMonth]._id,
                information: 'notProductionDay'
            });
            pxx.push({
                type: "day",
                value: val.leavingDay,
                userId: listConsultant[incr]._id,
                pxxId: pxxInfo.data[incrMonth]._id,
                information: 'leavingDay'
            });
            pxx.push({
                type: "day",
                value: val.availableDay,
                userId: listConsultant[incr]._id,
                pxxId: pxxInfo.data[incrMonth]._id,
                information: 'availableDay'
            });
        }

        listPxx.push(pxx);
    }

    return listPxx;

}

const transformPxxMonthInfoToDisplay = (pxxInfo) => {
    const pxxMonthInfoList = []
    const firstLine = [];
    const secondLine = [];

    for (let incr = 0; incr < pxxInfo.data.length; incr++){
        
        firstLine.push({
            name: pxxInfo.data[incr].name,
            value: pxxInfo.data[incr].workingday
        });
        firstLine.push({ name:'', value:'' });
        firstLine.push({ name:'', value:'' });
        firstLine.push({ name:'', value:'' });
    }

    for (let incr = 0; incr < pxxInfo.data.length; incr++){
        secondLine.push({ name:'Prod', value: 'P'});
        secondLine.push({ name: 'Not Prod', value: 'NP'});
        secondLine.push({ name: 'Hollidays', value: 'H'});
        secondLine.push({ name: 'Availability', value: 'A'});
    }
    pxxMonthInfoList.push(firstLine, secondLine);

    return pxxMonthInfoList;
}

export const getPxxList = (searchDate, numberOfMonth) => async (dispatch, getState) => {

    try {

        dispatch({ type: PXX_LIST_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers:{
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };
        
        const pxxInfo = await axios.get(`/api/monthdata?searchdate=${searchDate}&numberofmonths=${numberOfMonth}`);
        const pxxMonthInfoList = transformPxxMonthInfoToDisplay(pxxInfo);

        let monthId = "";
        for (let incr = 0; incr < pxxInfo.data.length; incr++) {
            if (incr === 0) {
                monthId = pxxInfo.data[incr]._id;
            }
            monthId = monthId + '_' + pxxInfo.data[incr]._id;
        }

        const pxxData = await axios.get(`/api/pxx/${monthId}`, config);
        const listPxx = transformListPxxToDisplay(pxxData, pxxInfo);

        dispatch({ type: PXX_LIST_SUCCESS, payload: { pxxMonthInformation: pxxMonthInfoList, pxxUserList: listPxx } });


    } catch (error) {
        dispatch({
            type: PXX_LIST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const getTace = (practice, start, end) => async (dispatch, getState) => {

    try {

        dispatch({ type: PXX_TACE_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers:{
                Authorization: `Bearer ${userInfo.token}`
            }
        };
        const { data } = await axios.get(`/api/pxx/chart/tace?practice=${practice}&start=${start}&end=${end}`, config);

        dispatch({ type: PXX_TACE_SUCCESS, payload: data });


    } catch (error) {
        dispatch({
            type: PXX_TACE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const getAvailabilities = (practice, start, end, skills, experienceStart, experienceEnd, searchMode) => async (dispatch, getState) => {

    try {

        dispatch({ type: PXX_AVAILABILITIES_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers:{
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        let searchExperience = experienceStart.toString();
        if (experienceEnd) {
            searchExperience = searchExperience + '-' + experienceEnd.toString()
        }

        const { data } = await axios.get(`/api/pxx/chart/availability?practice=${practice}&start=${start}&end=${end}&skills=${skills}&experience=${searchExperience}&filterMode=${searchMode}`, config);

        dispatch({ type: PXX_AVAILABILITIES_SUCCESS, payload: data });


    } catch (error) {
        dispatch({
            type: PXX_AVAILABILITIES_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const getAllPxx = (practice = '', month = '', keywork = '', pageSize = '10', pageNumber = '1') => async (dispatch, getState) => {

    try {

        dispatch({ type: PXX_ALL_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers:{
                Authorization: `Bearer ${userInfo.token}`
            }
        };
        const { data } = await axios.get(`/api/pxx?practice=${practice}&month=${month}&keyword=${keywork}&pageSize=${pageSize}&pageNumber=${pageNumber}`, config);

        dispatch({ type: PXX_ALL_SUCCESS, payload: data });


    } catch (error) {
        dispatch({
            type: PXX_ALL_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const pxxImportInMass = (datas) => async (dispatch, getState) => {

    try {

        dispatch({ type: PXX_IMPORT_MASS_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers:{
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };
        const { data } = await axios.put(`/api/pxx/admin/mass-import`, datas, config);

        dispatch({ type: PXX_IMPORT_MASS_SUCCESS, payload: data });


    } catch (error) {
        dispatch({
            type: PXX_IMPORT_MASS_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

export const pxxUpdateALine = (line) => async (dispatch, getState) => {

    try {

        dispatch({ type: PXX_IMPORT_LINE_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers:{
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };
        const { data } = await axios.put(`/api/pxx/admin/line-import`, line, config);

        dispatch({ type: PXX_IMPORT_LINE_SUCCESS, payload: data });


    } catch (error) {
        dispatch({
            type: PXX_IMPORT_LINE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};