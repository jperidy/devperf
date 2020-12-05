const bcrypt = require('bcryptjs');

function getCDMData (nbCdm) {
    let matricule = 1000;
    const listOfCdm = []
    for (let incr = 0 ; incr < nbCdm ; incr++) {

        let arrival = new Date( 2019 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 11), Math.floor(Math.random() * 20))
        let leaving = new Date( 2023 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 11), Math.floor(Math.random() * 20))
        let seniority = (Date.now() - arrival) / (1000*3600*24*365.25);
        cdm = {
            name: 'userCDM'+ matricule,
            matricule: 'matricule' + matricule,
            email: 'userCDM' + matricule + '@mail.com',
            password: bcrypt.hashSync('123456', 10),
            arrival: arrival,
            valued: arrival,
            leaving: leaving,
            seniority: seniority,
            isCDM: true,
            isAdmin: false
        };
        listOfCdm.push(cdm);
        matricule++;
    }
    return listOfCdm;
}

function getUserData (nbUsers, cdmId) {
    let numberOfAdmin = 1;
    let matricule = 0;
    const listOfUsers = []
    let incr2 = 0;

    for (let iter = 0 ; iter < nbUsers ; iter++){

        let arrival = new Date( 2019 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 11), Math.floor(Math.random() * 20))
        let leaving = new Date( 2023 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 11), Math.floor(Math.random() * 20))
        let seniority = (Date.now() - arrival) / (1000*3600*24*365.25);
        
        if (numberOfAdmin > 0) {
            user = {
                name: 'user'+ matricule,
                matricule: 'matricule' + matricule,
                email: 'user' + matricule + '@mail.com',
                password: bcrypt.hashSync('123456', 10),
                arrival: arrival,
                valued: arrival,
                leaving: leaving,
                seniority: seniority,
                isCDM: false,
                isAdmin: true,
                cdmId: cdmId[incr2]
            };
            numberOfAdmin--;
        } else {
            user = {
                name: 'user'+ matricule,
                matricule: 'matricule' + matricule,
                email: 'user' + matricule + '@mail.com',
                password: bcrypt.hashSync('123456', 10),
                arrival: arrival,
                valued: arrival,
                leaving: leaving,
                seniority: seniority,
                isCDM: false,
                isAdmin: false,
                cdmId: cdmId[incr2]
            };
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

module.exports = {getUserData, getCDMData};