//const bcrypt = require('bcryptjs');

function getCDMData (nbCdm, skills, practice) {
    const grade = ['Analyst', 'Consultant', 'Senior consultant', 'Manager', 'Senior manager', 'Director', 'Partner'];
    let matricule = 1000;
    const listOfCdm = [];
    
    
    for (let incr = 0 ; incr < nbCdm ; incr++) {
        const quality = [];
        for (let incr = 0 ; incr < 5 ; incr++) {
            quality.push({
                skill: skills[(Math.floor(Math.random() * (skills.length -1)))]._id,
                level: Number(1 + Math.floor(Math.random() * 2))
            })
        }
        
        let arrival = new Date( 2019 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 11), Math.floor(Math.random() * 20))
        let leaving = new Date( 2023 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 11), Math.floor(Math.random() * 20))
        cdm = {
            name: 'cdm'+ practice.toLowerCase() + matricule,
            matricule: practice + 'matricule' + matricule,
            email: `cdm${practice.toLowerCase()}${matricule}@mail.com`,
            grade: grade[ 2 + Math.floor(Math.random() * (grade.length - 3))],
            arrival: arrival,
            valued: arrival,
            leaving: leaving,
            practice: practice,
            isCDM: true,
            isPartialTime:{ value: false, week: [{num:1, worked:1},{num:2, worked:1},{num:3, worked:1},{num:4, worked:1},{num:5, worked:1}], start: '', end: ''},
            quality: quality
        };
        listOfCdm.push(cdm);
        matricule++;
    }
    return listOfCdm;
}

function getConsultantData (nbUsers, cdmId, skills, practice) {
    
    const grade = ['Analyst', 'Consultant', 'Senior consultant', 'Manager', 'Senior manager', 'Director', 'Partner'];
    const nameDataSet = ['Richard', 'Benoit', 'Jacques', 'Laurine', 'Isabelle', 'Jeanne', 'Arthur', 'Jessica', 'Jean'];
    const secondNameDataSet = ['DURAND', 'MARTIN', 'BERNARD', 'THOMAS', 'PETIT', 'MICHEL', 'ROUX'];

    let matricule = 0;
    const listOfUsers = []
    let incr2 = 0;

    
    for (let iter = 0 ; iter < nbUsers ; iter++){
        const quality = [];
        for (let incr = 0 ; incr < 5 ; incr++) {
            quality.push({
                skill: skills[(Math.floor(Math.random() * (skills.length -1)))]._id,
                level: Number(1 + Math.floor(Math.random() * 2))
            })
        }
        
        let arrival = new Date(2019 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 11), Math.floor(Math.random() * 20))
        let leaving = new Date(2023 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 11), Math.floor(Math.random() * 20))
        let seniority = (Date.now() - arrival) / (1000 * 3600 * 24 * 365.25);

        const name = nameDataSet[Math.floor(Math.random() * (nameDataSet.length - 1))] + ' ' + secondNameDataSet[Math.floor(Math.random() * (nameDataSet.length - 1))];

        user = {
            name: name,
            matricule: practice + 'matricule' + matricule,
            email: name.toLowerCase().replace(' ', '') + practice.toLowerCase() + matricule + '@mail.com',
            grade: grade[Math.floor(Math.random() * (grade.length -1))],
            arrival: arrival,
            valued: arrival,
            leaving: leaving,
            seniority: seniority,
            practice: practice,
            isCDM: false,
            isPartialTime: { value: false, week: [{ num: 1, worked: 1 }, { num: 2, worked: 1 }, { num: 3, worked: 1 }, { num: 4, worked: 1 }, { num: 5, worked: 1 }], start: '', end: '' },
            cdmId: cdmId[incr2],
            quality: quality
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