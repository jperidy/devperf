const axios = require('axios');

// functions
Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + days);
    return this;
};
Date.prototype.addMonth = function (months) {
    this.setMonth(this.getMonth() + months);
    return this;
};

function clone(obj) {
    try {
        var copy = JSON.parse(JSON.stringify(obj));
    } catch (ex) {
        alert("fail trying to copie object");
    }
    return copy;
}

function typeOfDay(day) {
    switch (day) {
        case 0:
            return 'weed-end';
        case 1:
            return 'working-day';
        case 2:
            return 'working-day';
        case 3:
            return 'working-day';
        case 4:
            return 'working-day';
        case 5:
            return 'working-day';
        case 6:
            return 'weekend';
        default:
            return 'working-day';
    }
}

// Configuration of start and end dates
//const startDate = new Date('2020-11-11');
//const endDate = new Date('2021-07-27');


async function getMonthData(startDate, endDate) {
    
    startDate.setDate(1);
    endDate.addMonth(1);
    endDate.setDate(1);

    const month = {
        name: startDate.getFullYear().toString() + '/' + Number(startDate.getMonth() + 1).toString(),
        firstDay: startDate.toISOString().substring(0, 10),
        days: []
    };

    const tableau = [];
    let currentMonth = startDate.getMonth();
    let newMonth;

    for (let currentDay = startDate; currentDay <= endDate; currentDay.addDays(1)) {
        newMonth = currentDay.getMonth();

        if (newMonth == currentMonth) {

            startDateTemp = currentDay.toISOString().substring(0, 10);
            month.days.push({ num: startDateTemp, type: typeOfDay(currentDay.getDay()) });

        } else if ((newMonth == currentMonth + 1) || (newMonth === 0 && currentMonth === 11)) {
            tableau.push(clone(month));
            month.name = currentDay.getFullYear().toString() + '/' + Number(currentDay.getMonth() + 1).toString();
            month.firstDay = currentDay.toISOString().substring(0, 10);
            month.days = [{ num: currentDay.toISOString().substring(0, 10), type: typeOfDay(currentDay.getDay()) }];
            currentMonth = newMonth;
        } else {
            console.error('something wrong in building months');
        }
    }

    let currentyear = 0;
    let type = '';
    let num = '';

    for (let incr = 0; incr < tableau.length; incr++) {

        currentyear = tableau[incr].name.substring(0, 4);
        //console.log('currentyear', currentyear);

        const { data } = await axios.get(`https://calendrier.api.gouv.fr/jours-feries/metropole/${currentyear}.json`);
        //console.log('data', data);

        for (let iter = 0; iter < tableau[incr].days.length; iter++) {
            num = tableau[incr].days[iter].num;
            //console.log('num', num);
            type = tableau[incr].days[iter].type;

            if (data[num]) {
                tableau[incr].days[iter].type = 'non-working-day';
                //console.log('Modified day: ', tableau[incr].days[iter]);
            }

        }
    }

    return tableau;
}

//const data = getMonthData(startDate, endDate);

module.exports = getMonthData;


/*

const monthData = [
    {
        month: '11/20',
        days: [
            { num: 1, type: 'week-end' },
            { num: 2, type: 'working-day' },
            { num: 3, type: 'working-day' },
            { num: 4, type: 'working-day' },
            { num: 5, type: 'working-day' },
            { num: 6, type: 'working-day' },
            { num: 7, type: 'week-end' },
            { num: 8, type: 'week-end' },
            { num: 9, type: 'working-day' },
            { num: 10, type: 'working-day' },
            { num: 11, type: 'non-working-day' },
            { num: 12, type: 'working-day' },
            { num: 13, type: 'working-day' },
            { num: 14, type: 'week-end' },
            { num: 15, type: 'week-end' },
            { num: 16, type: 'working-day' },
            { num: 17, type: 'working-day' },
            { num: 18, type: 'working-day' },
            { num: 19, type: 'working-day' },
            { num: 20, type: 'working-day' },
            { num: 21, type: 'week-end' },
            { num: 22, type: 'week-end' },
            { num: 23, type: 'working-day' },
            { num: 24, type: 'working-day' },
            { num: 25, type: 'working-day' },
            { num: 26, type: 'working-day' },
            { num: 27, type: 'working-day' },
            { num: 28, type: 'week-end' },
            { num: 29, type: 'week-end' },
            { num: 30, type: 'working-day' }
        ]
    },
    {
        month: '12/20',
        days: [
            { num: 1, type: 'working-day' },
            { num: 2, type: 'working-day' },
            { num: 3, type: 'working-day' },
            { num: 4, type: 'working-day' },
            { num: 5, type: 'week-end' },
            { num: 6, type: 'week-end' },
            { num: 7, type: 'working-day' },
            { num: 8, type: 'working-day' },
            { num: 9, type: 'working-day' },
            { num: 10, type: 'working-day' },
            { num: 11, type: 'working-day' },
            { num: 12, type: 'week-end' },
            { num: 13, type: 'week-end' },
            { num: 14, type: 'working-day' },
            { num: 15, type: 'working-day' },
            { num: 16, type: 'working-day' },
            { num: 17, type: 'working-day' },
            { num: 18, type: 'working-day' },
            { num: 19, type: 'week-end' },
            { num: 20, type: 'week-end' },
            { num: 21, type: 'working-day' },
            { num: 22, type: 'working-day' },
            { num: 23, type: 'working-day' },
            { num: 24, type: 'working-day' },
            { num: 25, type: 'non-working-day' },
            { num: 26, type: 'week-end' },
            { num: 27, type: 'week-end' },
            { num: 28, type: 'working-day' },
            { num: 29, type: 'working-day' },
            { num: 30, type: 'working-day' },
            { num: 31, type: 'working-day' }
        ]
    },
    {
        month: '01/21',
        days: [
            { num: 1, type: 'working-day' },
            { num: 2, type: 'week-end' },
            { num: 3, type: 'week-end' },
            { num: 4, type: 'working-day' },
            { num: 5, type: 'working-day' },
            { num: 6, type: 'working-day' },
            { num: 7, type: 'working-day' },
            { num: 8, type: 'working-day' },
            { num: 9, type: 'week-end' },
            { num: 10, type: 'week-end' },
            { num: 11, type: 'working-day' },
            { num: 12, type: 'working-day' },
            { num: 13, type: 'working-day' },
            { num: 14, type: 'working-day' },
            { num: 15, type: 'working-day' },
            { num: 16, type: 'week-end' },
            { num: 17, type: 'week-end' },
            { num: 18, type: 'working-day' },
            { num: 19, type: 'working-day' },
            { num: 20, type: 'working-day' },
            { num: 21, type: 'working-day' },
            { num: 22, type: 'working-day' },
            { num: 23, type: 'week-end' },
            { num: 24, type: 'week-end' },
            { num: 25, type: 'working-day' },
            { num: 26, type: 'working-day' },
            { num: 27, type: 'working-day' },
            { num: 28, type: 'working-day' },
            { num: 29, type: 'working-day' },
            { num: 30, type: 'week-end' },
            { num: 31, type: 'week-end' }
        ]
    }
];

module.exports = monthData;

*/