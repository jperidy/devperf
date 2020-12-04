const calculDayByType = require('../utils/calculDayByType');

/*function calculDayByType(days, type) {
    const nbDays = (days.map((day) => {
        if (day.type === type) {
            return 1;
        } else {
            return 0;
        }
    })).reduce((acc, item) => acc + item);
    return nbDays;
};
*/

function getPxxData(monthInfo, users) {

    //console.log('monthInfo', monthInfo);
    //console.log('users', users);

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
            
            //console.log(pxxUser);
            pxxData.push(pxxUser);
        }
    }
    //console.log(pxxData);
    return pxxData;
}

module.exports = getPxxData;

/*
const pxxData = [
    {
        name: "Prénom NOM1",
        arrival: '25/11/2013',
        leaving: '31/12/2021',
        seniority: '7 years',
        pap: [
            {
                month: "11/20",
                prodDay: 12,
                nonProdDay: 11,
                leaving: 2,
                availability: 2
            },
            {
                month: "12/20",
                prodDay: 12,
                nonProdDay: 11,
                leaving: 2,
                availability: 2
            },
            {
                month: "01/01",
                prodDay: 12,
                nonProdDay: 11,
                leaving: 2,
                availability: 2
            }
        ]
    },
    {
        name: "Prénom NOM2",
        arrival: '25/11/2013',
        leaving: '31/12/2021',
        seniority: '7 years',
        pap: [
            {
                month: "11/20",
                prodDay: 12,
                nonProdDay: 11,
                leaving: 2,
                availability: 2
            },
            {
                month: "12/20",
                prodDay: 12,
                nonProdDay: 11,
                leaving: 2,
                availability: 2
            },
            {
                month: "01/01",
                prodDay: 12,
                nonProdDay: 11,
                leaving: 2,
                availability: 2
            }
        ]
    }
];

export default pxxData;

*/