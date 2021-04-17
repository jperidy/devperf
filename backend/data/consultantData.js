//const bcrypt = require('bcryptjs');
const Consultant = require('../models/consultantModel');
const cryptoJS = require('crypto-js');
const bcrypt = require('bcryptjs');
const path = require('path');
const readXlsxFile = require('read-excel-file/node');
const User = require('../models/userModel');

function getCDMData (nbCdm, skills, practice) {
    const grade = ['Intern', 'Analyst', 'Consultant', 'Senior consultant', 'Manager', 'Senior manager', 'Director', 'Partner'];
    let matricule = 1000;
    const listOfCdm = [];
    
    
    for (let incr = 0 ; incr < nbCdm ; incr++) {
        const quality = [];
        for (let incr = 0 ; incr < 5 ; incr++) {
            const newSkill = skills[(Math.round(Math.random() * (skills.length -1)))]._id;
            if (!quality.map(x => x.skill).includes(newSkill)) {
                quality.push({
                    skill: newSkill,
                    level: Number(1 + Math.round(Math.random() * 2))
                })
            }
            /*quality.push({
                skill: skills[(Math.round(Math.random() * (skills.length -1)))]._id,
                level: Number(1 + Math.round(Math.random() * 2))
            })*/
        }
        
        let arrival = new Date( 2019 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 11), Math.floor(Math.random() * 20))
        let leaving = new Date( 2023 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 11), Math.floor(Math.random() * 20))
        cdm = {
            name: 'cdm'+ practice.toLowerCase() + matricule,
            matricule: practice + 'matricule' + matricule,
            email: `cdm${practice.toLowerCase()}${matricule}@mail.com`,
            grade: grade[ 2 + Math.round(Math.random() * (grade.length - 3))],
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
    
    const grade = ['Intern', 'Analyst', 'Consultant', 'Senior consultant', 'Manager', 'Senior manager', 'Director', 'Partner'];
    const nameDataSet = ['Richard', 'Benoit', 'Jacques', 'Laurine', 'Isabelle', 'Jeanne', 'Arthur', 'Jessica', 'Jean', 'Paul', 'Marion', 'Julien', 'Sophie'];
    const secondNameDataSet = ['DURAND', 'MARTIN', 'DUPONT', 'THOMAS', 'PETIT', 'MICHEL', 'ROUX', 'DUBOIS', 'ROBERT', 'BRUN'];

    let matricule = 0;
    const listOfUsers = [];
    let incr2 = 0;

    
    for (let iter = 0 ; iter < nbUsers ; iter++){
        const quality = [];
        for (let incr = 0 ; incr < 5 ; incr++) {

            const newSkill = skills[(Math.round(Math.random() * (skills.length -1)))]._id;
            if (!quality.map(x => x.skill).includes(newSkill)) {
                quality.push({
                    skill: newSkill,
                    level: Number(1 + Math.round(Math.random() * 2))
                })
            }
        }
        
        let arrival = new Date(2019 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 11), Math.floor(Math.random() * 20))
        let seniority = (Date.now() - arrival) / (1000 * 3600 * 24 * 365.25);

        const name = nameDataSet[Math.round(Math.random() * (nameDataSet.length - 1))] + ' ' + secondNameDataSet[Math.round(Math.random() * (secondNameDataSet.length - 1))];

        user = {
            name: name,
            matricule: practice + 'matricule' + matricule,
            email: name.toLowerCase().replace(' ', '') + practice.toLowerCase() + matricule + '@mail.com',
            grade: grade[Math.round(Math.random() * (grade.length - 1))],
            arrival: arrival,
            valued: arrival,
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

function transformGrade (gradeIn) {
    let gradeOut = '';

    if (gradeIn.match(/Analyst|Analyst Consultant/g)) {
        gradeOut = 'Analyst'
    };
    if (gradeIn.match(/Consultant/g)) {
        gradeOut = 'Consultant'
    };
    if (gradeIn.match(/Manager|Expert/g)) {
        gradeOut = 'Manager'
    };
    if (gradeIn.match(/Senior consultant|Senior Consultant/g)) {
        gradeOut = 'Senior consultant'
    };
    if (gradeIn.match(/Intern|Stagiaire|Alternant Conseil/g)) {
        gradeOut = 'Intern'
    };
    if (gradeIn.match(/Commercial|Account Developer|Account Manager|Business Analyst/g)) {
        gradeOut = 'Commercial'
    };
    if (gradeIn.match(/Senior manager|Senior Manager/g)) {
        gradeOut = 'Senior manager'
    };
    if (gradeIn.match(/Director|Directeur de Projet|Directeur Associé/g)) {
        gradeOut = 'Director'
    };
    if (gradeIn.match(/Research|Research analyst|Senior Research Analyst/g)) {
        gradeOut = 'Research'
    };
    if (gradeIn.match(/Partner/g)) {
        gradeOut = 'Partner'
    };

    if (gradeOut === '') {
        console.log('Grade not recognized: ' + gradeIn);
        gradeOut = 'Unknown'
    }

    return gradeOut;
}

async function updateAConsultant (id, consultant, cdmProfil) {

    const consultantUpdated = await Consultant.findOneAndUpdate({ _id: id }, consultant, { new: true });

    if (consultantUpdated.isCDM) {
        const userToUpdate = await User.findOne({consultantProfil: consultantUpdated._id});
        if (!userToUpdate) {
            const cdmUser = {
                name: consultantUpdated.name,
                email: consultantUpdated.email,
                password : '123456',
                //password : bcrypt.hashSync('123456', 10),
                consultantProfil: consultantUpdated._id,
                isCDM: consultantUpdated.isCDM,
                profil: cdmProfil,
                status: 'Waiting approval'
            }
            const newCdmUser = await User.create(cdmUser);
        }
    }

    return consultantUpdated;
}

async function createAConsultant (consultant, cdmProfil) {
    const consultantToCreate = {
        ...consultant,
        isPartialTime: {
            value: false,
            week: [{ num: 1, worked: 1 }, { num: 2, worked: 1 }, { num: 3, worked: 1 }, { num: 4, worked: 1 }, { num: 5, worked: 1 }],
            start: '',
            end: ''
        }
    }
    const newConsultant = await Consultant.create(consultantToCreate);

    if (newConsultant) {

        if (newConsultant.isCDM) {
            const cdmUser = {
                name: newConsultant.name,
                email: newConsultant.email,
                password : '123456',
                //password : bcrypt.hashSync('123456', 10),
                consultantProfil: newConsultant._id,
                isCDM: newConsultant.isCDM,
                profil: cdmProfil,
                status: 'Waiting approval'
            }
            const newCdmUser = await User.create(cdmUser);
            //console.log('new user created: ' + newCdmUser.name);
        }
        return newConsultant;
    } else {
        return '';
    }
}

async function getConsultantDataFromWk(fileName, practiceName, cdmProfilAccess) {

    const anonymise = false;

    let numberOfConsultant = 0;
    let numberOfUpdate = 0;
    let numberOfCreate = 0;
    let numberOfErrors = 0;
    let numberOfWarning = 0;

    //console.log(req.body);
    //const filePath = req.body.path;
    const filePath = '/backend/data/' + fileName;

    const schema = {
        'Collaborateur/Nom': { prop: 'name', type: String },
        'Collaborateur/Matricule cabinet': { prop: 'matricule', type: String },
        'Collaborateur/Grade/Grade': { prop: 'grade', type: String },
        'Collaborateur/Date de début de vie active valorisée': { prop: 'valued', type: Date },
        "Collaborateur/Date d'embauche": { prop: 'start', type: Date },
        'Collaborateur/Last Date End': { prop: 'leave', type: Date },
        'Taux de présence': { prop: 'partialTime', type: Number },
        'Présence': { prop: 'presence', type: Number },
        'Type de Contrat/Type de Contrat': { prop: 'contract', type: String },
        'Collaborateur/Est un CD Manager': {
            prop: 'isCdm', type: (value) => {
                if (value === 1 || value === true) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        'Collaborateur/CD Manager/Matricule cabinet': { prop: 'cdmMatricule', type: String },
        'Collaborateur/CD Manager/Nom': { prop: 'cdmName', type: String },
        'Practice/Nom affiché': { prop: 'practice', type: String }
    }

    const __dir = path.resolve();
    const file = __dir + filePath // '/backend/data/hr.presence.xlsx';
    const { rows, error } = await readXlsxFile(file, { schema });


    const message = [];
    // stamps to avoid to proceed too much request
    const practice = practiceName;
    const consultantsAllPractice = await Consultant.find({practice: practice});

    for (let line = 0; line < rows.length; line++) {
        numberOfConsultant += 1;
        const consultant = rows[line];
        console.log('-----------------------> ' + line + ': ' + consultant.name);

        const searchConsultant = consultantsAllPractice.filter(x => x.matricule === consultant.matricule)[0];
        const cdmMatricule = consultant.cdmMatricule ? consultant.cdmMatricule.toString().padStart(9, 0) : '';
        const cdmProfil = consultantsAllPractice.filter(x => x.matricule === cdmMatricule)[0];
        let cdmId = null;
        if (cdmProfil) {
            cdmId = cdmProfil._id;            
        } else {
            numberOfWarning += 1;
            const msgCdm = `Warning - CDM Profil not found for consultant ${consultant.name} (${consultant.matricule}) and CDM ${consultant.cdmName} (${consultant.cdmMatricule}). >> Please verify profil`;
            console.log(msgCdm);
        }  

        const consultantToUpdateOrCreate = {
            name: anonymise ? `Prénom NOM ${line + 1}` : consultant.name,
            //email: `prenom-nom-${line + 1}@jprmail.com`,
            //email: cryptoJS.MD5(consultant.name).toString(),
            email: consultant.name.replace(' ', '.').toLowerCase() + '@mail.com',
            grade: transformGrade(consultant.grade),
            practice: consultant.practice.split('-')[1],
            matricule: consultant.matricule,
            arrival: consultant.start ? consultant.start : null,
            valued: consultant.valued ? consultant.valued : consultant.start ? consultant.start : null,
            leaving: consultant.leave && (consultant.leave > consultant.arrival) ? consultant.leave : null,
            isCDM: consultant.isCdm,
            cdmId: cdmId ? cdmId._id : null,
        }

        const startMonth = new Date(Date.now());
        startMonth.setUTCDate(0);

        if (consultant.presence === 0 && consultant.partialTime > 0 && !consultant.leave && consultant.start < startMonth) {
            const msg = `Warning - something wront with ${consultant.name}. Presence=0 but no partial time and no leaving date.`
            console.log(msg);
        }

        let result = '';
        let info = '';

        if (searchConsultant) {

            result = await updateAConsultant(searchConsultant._id, consultantToUpdateOrCreate, cdmProfilAccess);
            if (result) {
                info = `Warning - update - ${consultant.name} (${consultant.matricule}) - ${result._id}`;
                if (consultant.partialTime < 1 && result.isPartialTime.value === false) {
                    info += `\n\t>>Warning - you have to modify partial time - ${consultant.name} (${consultant.matricule}) - ${result._id} > set partial time to ${consultant.partialTime}`
                    console.log(info);
                }
                message.push({
                    _id: result._id,
                    practice: consultant.practice.split('-')[1],
                    matricule: consultant.matricule,
                    name: consultant.name,
                    result: 'updated',
                    message: info
                });
                //resetAllPxx(result);
                numberOfUpdate += 1;
                
            } else {
                info = `Error - update - ${consultant.name} (${consultant.matricule}) - ${result._id}`
                message.push({
                    _id: 'unknown',
                    practice: consultant.practice.split('-')[1],
                    matricule: consultant.matricule,
                    name: consultant.name,
                    result: 'error',
                    message: info,
                    data: consultantToUpdateOrCreate
                });

                numberOfErrors += 1;
                console.log(info);
            }
        } else {
            result = await createAConsultant(consultantToUpdateOrCreate, cdmProfilAccess);
            if (result) {
                info = `Info - create - ${consultant.name} (${consultant.matricule}) - ${result._id}\n`;
                if (consultant.partialTime < 1) {
                    info += `\t>>Warning - add partial time - ${consultant.name} (${consultant.matricule}) - ${result._id}\n`

                }
                message.push({
                    _id: result._id,
                    practice: consultant.practice.split('-')[1],
                    matricule: consultant.matricule,
                    name: consultant.name,
                    result: 'created',
                    message: info
                });
                //resetAllPxx(result);
                numberOfCreate += 1;
            } else {
                info = `Error - create - ${consultant.name} (${consultant.matricule}) - ${result._id}`;
                message.push({
                    _id: 'unknown',
                    practice: consultant.practice.split('-')[1],
                    matricule: consultant.matricule,
                    name: consultant.name,
                    result: 'error',
                    message: info,
                    data: consultantToUpdateOrCreate
                });

                numberOfErrors += 1;
            }
        }
    }

    const practices = [... new Set(message.map(x => x.practice))];
    const updatedMatricules = [... new Set(message.map(x => x.matricule))];

    const startMonth = new Date(Date.now());
    startMonth.setUTCDate(1);

    const endMonth = new Date(Date.now());
    endMonth.setUTCMonth(endMonth.getUTCMonth() + 1);
    endMonth.setUTCDate(0);

    const allConsultantsActivesInDatabase = await Consultant.find({
        $or: [
            { practice: { $in: practices }, arrival: { $lte: startMonth }, leaving: { $gte: endMonth } },
            { practice: { $in: practices }, arrival: { $lte: startMonth }, leaving: null }
        ]
    });

    const consultantNotUpdated = allConsultantsActivesInDatabase.filter(x => !updatedMatricules.includes(x.matricule));
    const numberOfNotFound = consultantNotUpdated.length;

    for (let incr = 0; incr < consultantNotUpdated.length; incr++) {
        info = `Warning - not found in import file - ${consultantNotUpdated[incr].name} (${consultantNotUpdated[incr].matricule}) - ${consultantNotUpdated[incr]._id}`
        message.push({
            _id: consultantNotUpdated[incr]._id,
            practice: consultantNotUpdated[incr].practice,
            matricule: consultantNotUpdated[incr].matricule,
            name: consultantNotUpdated[incr].name,
            result: 'warning',
            message: info,
            data: consultantNotUpdated[incr]
        });
        console.log(info);
    }

    return 'All consultant data imported';

}

module.exports = {getConsultantData, getCDMData, getConsultantDataFromWk};