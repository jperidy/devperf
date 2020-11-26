import axios from 'axios';
import {
    PXX_LIST_REQUEST,
    PXX_LIST_SUCCESS,
    PXX_LIST_FAIL
} from '../constants/pxxConstants';

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
    //console.log('listConsultant', listConsultant);


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

            //console.log(pxxData.data.filter( x => (x.name._id === listConsultant[incr]._id && x.month._id === pxxInfo.data[incrMonth]._id))[0]._id)
            let val = pxxData.data.filter(x => (x.name._id === listConsultant[incr]._id && x.month._id === pxxInfo.data[incrMonth]._id))[0];
            if (val.length > 1) {
                throw new Error({ message: 'number of value can not be up to 1' })
            }
            //pxx.push(val._id);
            //pxx.push(pxxInfo.data[incrMonth]);
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

    //pxxMonthInfoList.push(firstLine);

    for (let incr = 0; incr < pxxInfo.data.length; incr++){
        secondLine.push({ name:'Prod', value: 'P'});
        secondLine.push({ name: 'Not Prod', value: 'NP'});
        secondLine.push({ name: 'Hollidays', value: 'H'});
        secondLine.push({ name: 'Availability', value: 'A'});
    }
    pxxMonthInfoList.push(firstLine, secondLine);

    return pxxMonthInfoList;
}

export const getPxxList = (searchDate, numberOfMonth) => async (dispatch) => {

    try {

        dispatch({ type: PXX_LIST_REQUEST });
        const pxxInfo = await axios.get(`/api/monthdata?searchdate=${searchDate}&numberofmonths=${numberOfMonth}`);
        const pxxMonthInfoList = transformPxxMonthInfoToDisplay(pxxInfo);
        //console.log('pxxMonthInfoList', pxxMonthInfoList);

        let monthId = "";
        for (let incr = 0; incr < pxxInfo.data.length; incr++) {
            if (incr === 0) {
                monthId = pxxInfo.data[incr]._id;
            }
            monthId = monthId + '_' + pxxInfo.data[incr]._id;
        }

        const pxxData = await axios.get(`/api/pxx/${monthId}`);
        const listPxx = transformListPxxToDisplay(pxxData, pxxInfo);

        // console.log('listPxx', listPxx);
        //console.log('pxxMonthInfoList', typeof pxxMonthInfoList, pxxMonthInfoList);
        //console.log('pxxUserList',typeof listPxx, listPxx);
        

        //dispatch({ type: PXX_LIST_SUCCESS, payload: { pxxMonthInformation: pxxInfo.data, pxxUserList: listPxx } });
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