const calculDayByType = require('../utils/calculDayByType');


function getPxxData(monthInfo, users) {

    const pxxData = [];
    for (let iterUser = 0 ; iterUser < users.length; iterUser++) {
        
        for (let iterMonth = 0; iterMonth < monthInfo.length; iterMonth++) {
            
            let pxxUser = { name: users[iterUser]._id }
            let workingDay = calculDayByType(monthInfo[iterMonth].days, 'working-day');
            let monthPap = monthInfo[iterMonth]._id;
            let leavingPap = Math.floor(Math.random() * 3);
            let prodDayPap = Math.floor(Math.random() * (workingDay - leavingPap));
            let notProdDayPap = Math.floor(Math.random() * (workingDay - prodDayPap));
            let availableDayPap = workingDay - prodDayPap - leavingPap - notProdDayPap;

            pxxUser.month = monthPap;
            pxxUser.prodDay = Number(prodDayPap);
            pxxUser.notProdDay = Number(notProdDayPap);
            pxxUser.leavingDay = Number(leavingPap);
            pxxUser.availableDay = Number(availableDayPap);
            
            pxxData.push(pxxUser);
        }
    }
    return pxxData;
}

module.exports = getPxxData;