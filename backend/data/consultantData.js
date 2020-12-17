//const bcrypt = require('bcryptjs');

function getCDMData (nbCdm) {
    let matricule = 1000;
    const listOfCdm = []
    for (let incr = 0 ; incr < nbCdm ; incr++) {

        let arrival = new Date( 2019 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 11), Math.floor(Math.random() * 20))
        let leaving = new Date( 2023 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 11), Math.floor(Math.random() * 20))
        cdm = {
            name: 'usercdm_'+ matricule,
            matricule: 'matricule' + matricule,
            email: 'usercdm_' + matricule + '@mail.com',
            //password: bcrypt.hashSync('123456', 10),
            arrival: arrival,
            valued: arrival,
            leaving: leaving,
            practice: 'DET',
            isCDM: true,
            isPartialTime:{ value: false, week: [{num:1, worked:1},{num:2, worked:1},{num:3, worked:1},{num:4, worked:1},{num:5, worked:1}], start: '', end: ''},
            //isAdmin: false
        };
        listOfCdm.push(cdm);
        matricule++;
    }
    return listOfCdm;
}

function getConsultantData (nbUsers, cdmId) {
    let matricule = 0;
    const listOfUsers = []
    let incr2 = 0;

    for (let iter = 0 ; iter < nbUsers ; iter++){

        let arrival = new Date(2019 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 11), Math.floor(Math.random() * 20))
        let leaving = new Date(2023 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 11), Math.floor(Math.random() * 20))
        let seniority = (Date.now() - arrival) / (1000 * 3600 * 24 * 365.25);

        user = {
            name: 'user_' + matricule,
            matricule: 'matricule' + matricule,
            email: 'user_' + matricule + '@mail.com',
            //password: bcrypt.hashSync('123456', 10),
            arrival: arrival,
            valued: arrival,
            leaving: leaving,
            seniority: seniority,
            practice: 'DET',
            isCDM: false,
            //isAdmin: false,
            isPartialTime: { value: false, week: [{ num: 1, worked: 1 }, { num: 2, worked: 1 }, { num: 3, worked: 1 }, { num: 4, worked: 1 }, { num: 5, worked: 1 }], start: '', end: '' },
            cdmId: cdmId[incr2]
        };
        
        listOfUsers.push(user);
        matricule++;
        if( (incr2 + 1) < cdmId.length){
            incr2++;
        } else {
            incr2 = 0;
        }
    }

    return listOfUsers;
}

module.exports = {getConsultantData, getCDMData};