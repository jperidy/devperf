const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Client = require('./models/clientModel');
const Month = require('./models/monthModel');
const User = require('./models/userModel');
const Consultant = require('./models/consultantModel');
const Pxx = require('./models/pxxModel');
const Skill = require('./models/skillModels');
const Deal = require('./models/dealModel');
const Access = require('./models/accessModel');
const prompt = require('prompt-sync')();
const path = require('path');
const fs = require('fs');

//const connectDB = require('./config/db');

const connectDB = async () => {

    let uri = '';
    
    if (['production', 'development', 'demo'].includes(process.env.NODE_ENV)) {
        uri = process.env.MONGO_URI_DEMO;
    } else if (process.env.NODE_ENV === 'docker') {
        uri = process.env.MONGO_URI_DOCKER.replace('@ressource-management-mongo-db:27017', '@localhost:27017');
    } else if (process.env.NODE_ENV === 'poc') {
        uri = process.env.MONGO_URI_POC;
    }
    
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
        .then((conn) => console.log(`MongoDB connected: ${conn.connection.host}`))
        .catch((error) => {
            console.log(`Error: ${error.message}`)
            process.exit(1)
        })
}

const {getConsultantData, getCDMData, getConsultantDataFromWk} = require('./data/consultantData');
const { getUserData } = require('./data/userData');
const { getSkills } = require('./data/skillData');
const { getDeals } = require('./data/dealsData');
const { controleAndCreatePxx } = require('./controllers/cronJobsControllers');
const { getAccessData } = require('./data/accessData');
const { getClient, initClient } = require('./data/clientData');

dotenv.config();

//let uri = '';

// if (['production', 'development'].includes(process.env.NODE_ENV)) {
//     uri = process.env.MONGO_URI_DEMO;
// } else if (process.env.NODE_ENV === 'poc') {
//     uri = process.env.MONGO_URI_POC;
//     connectDB();
// } else if (process.env.NODE_ENV === 'docker') {
//     uri = process.env.MONGO_URI_DOCKER;
//     connectDB(process.env.MONGO_URI_DOCKER.replace('@ressource-management-mongo-db:27017', '@localhost:27017'));
// }

connectDB();

const importData = async () => {
    
    // DELETE ALL CURRENT DATA
    try {
        
        await User.deleteMany();
        await Month.deleteMany();
        await Access.deleteMany();
        await Pxx.deleteMany();
        await Consultant.deleteMany();
        await Skill.deleteMany();
        await Deal.deleteMany();
        
        console.log('Data deleted');
        
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
    
    // CREATE NEW DATASET
    const nbConsultants = 100;
    const nbCdm = 10;

    
    try {
        const skillsData = getSkills();
        const skillsDataCreated = await Skill.insertMany(skillsData);
        console.log('skill created');

        const profilData = getAccessData();
        const profilDataCreated = await Access.insertMany(profilData);
        console.log('Profil data imported');

        const cdmProfil = profilDataCreated.filter(x => x.profil === 'cdm')[0]._id;
        const adminProfil = profilDataCreated.filter(x => x.profil === 'admin')[0]._id;
        const coordinatorProfil = profilDataCreated.filter(x => x.profil === 'coordinator')[0]._id;
        console.log('cdmProfil', cdmProfil);
        
        let ptc = 'PTC1';
        let cdmData = getCDMData(nbCdm, skillsDataCreated, ptc);
        let cdmDataCreated = await Consultant.insertMany(cdmData);
        console.log('consultant created');

        let cdmId = cdmDataCreated.map( x => x.practice === ptc && x._id);
        let consultantData = getConsultantData(nbConsultants, cdmId, skillsDataCreated, ptc);
        let consultantDataCreated = await Consultant.insertMany(consultantData);

        let allConsultants = await Consultant.find({practice: ptc});
        
        let userData = getUserData(allConsultants, {cdmProfil, adminProfil, coordinatorProfil});
        let userDataCreated = await User.insertMany(userData);
        console.log('PTC1 created');

        ptc = 'PTC2';
        cdmData = getCDMData(nbCdm, skillsDataCreated, ptc);
        cdmDataCreated = await Consultant.insertMany(cdmData);

        cdmId = cdmDataCreated.map( x => x.practice === ptc && x._id);
        consultantData = getConsultantData(nbConsultants, cdmId, skillsDataCreated, ptc);
        consultantDataCreated = await Consultant.insertMany(consultantData);

        allConsultants = await Consultant.find({practice: ptc});
        userData = getUserData(allConsultants, {cdmProfil, adminProfil, coordinatorProfil});
        userDataCreated = await User.insertMany(userData);
        console.log('PTC2 created');

        ptc = 'PTC3';
        cdmData = getCDMData(nbCdm, skillsDataCreated, ptc);
        cdmDataCreated = await Consultant.insertMany(cdmData);

        cdmId = cdmDataCreated.map( x => x.practice === ptc && x._id);
        consultantData = getConsultantData(nbConsultants, cdmId, skillsDataCreated, ptc);
        consultantDataCreated = await Consultant.insertMany(consultantData);

        allConsultants = await Consultant.find({practice: ptc});
        userData = getUserData(allConsultants, {cdmProfil, adminProfil, coordinatorProfil});
        userDataCreated = await User.insertMany(userData);
        console.log('PTC3 created');
        
        ptc = 'PTC4';
        cdmData = getCDMData(nbCdm, skillsDataCreated, ptc);
        cdmDataCreated = await Consultant.insertMany(cdmData);
        
        cdmId = cdmDataCreated.map( x => x.practice === ptc && x._id);
        consultantData = getConsultantData(nbConsultants, cdmId, skillsDataCreated, ptc);
        consultantDataCreated = await Consultant.insertMany(consultantData);
        
        allConsultants = await Consultant.find({practice: ptc});
        userData = getUserData(allConsultants, {cdmProfil, adminProfil, coordinatorProfil});
        userDataCreated = await User.insertMany(userData);
        console.log('PTC4 created');

        let allFinalConsultants = await Consultant.find();
        allFinalConsultants = allFinalConsultants.filter(x => ['Senior consultant', 'Manager', 'Senior manager', 'Director', 'Partner'].includes(x.grade));

        const nbDeals = 200;
        let practices = allFinalConsultants.map(x => x.practice);
        practices = [... new Set(practices)];
        dealsData = getDeals(nbDeals, allFinalConsultants, practices);
        dealsDataCreated = await Deal.insertMany(dealsData);
        console.log('Deals created');
        
        await getClient();

        console.log(new Date(Date.now()).toISOString() + ': ControleAndCreatePxx running >>> start');
        await controleAndCreatePxx(0);


        console.log('Data imported');
        process.exit();
        
        
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

const destroyData = async () => {

    try {
        
        await User.deleteMany();
        await Month.deleteMany();
        await Pxx.deleteMany();
        await Consultant.deleteMany();
        await Skill.deleteMany();
        
        console.log('Data deleted');
        process.exit();
        
    } catch (error) {
        console.error(error)
        process.exit(1)
    }

}

const profilImport = async () => {

    try {
        await Access.deleteMany();
        console.log('Profil data deleted');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }

    try {
        const profilData = getAccessData();
        const profilDataCreated = await Access.insertMany(profilData);
        console.log('Profil data imported');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

const profilUpdate = async () => {

    try {
        const profilData = getAccessData();
        for (let incr = 0; incr < profilData.length; incr++) {
            const searchProfil = await Access.findOne({profil: profilData[incr].profil});
            if (searchProfil) {
                searchProfil.level = profilData[incr].level;
                searchProfil.frontAccess = profilData[incr].frontAccess;
                searchProfil.api = profilData[incr].api;
                await searchProfil.save();
            }
        }
        console.log('Profil data updated');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

const clientUpdate = async () => {
    try {
        await getClient();
        process.exit()
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

const updateDb = async () => {

    // Data to update
    //let wkFileName = 'hr.presence-test-mail.xlsx';
    //let practice = 'DET';

    const __dir = path.resolve();
    const wkDirectory = __dir + '/backend/data/'
    const files = fs.readdirSync(wkDirectory);

    files.map( x => {
        if (x.match(/xls$|xlsx$/i)) {
            console.log(x);
        }
    })
    //console.log(files);

    const wkFileName = prompt('Please enter Wavekeeper filename > ');
    //const practice = prompt('Please enter practice name > ');
    const practice = ''; // not used
    const sendCredentialMessage = prompt('Do you want to send credentials to new created user ? (y/n) > ');
    const sendTestAdressMessage = prompt('Do you want to send credentials to test adress ? (y/n) > ');
    const userScope = prompt('Please select a scope to create user (all, cdm) > ');

    // *********** Populate skills
    const skillsData = getSkills();
    let createdSkill = 0;
    let updatedSkill = 0;
    for (let incr = 0 ; incr < skillsData.length ; incr++) {
        const skillToCreateOrUpdate = skillsData[incr];
        const existeSkill = await Skill.findOne({category: skillToCreateOrUpdate.category, name: skillToCreateOrUpdate.name});
        if (existeSkill) {
            existeSkill.description = skillToCreateOrUpdate.description;
            await existeSkill.save();
            updatedSkill += 1;
            console.log(`[update] skill > ${skillToCreateOrUpdate.name}`);
        } else {
            await Skill.create(skillToCreateOrUpdate);
            createdSkill += 1;
            console.log(`[create] skill > ${skillToCreateOrUpdate.name}`);
        }
    }
    //const skillsDataCreated = await Skill.insertMany(skillsData);
    console.log(`[result] created skills: ${createdSkill} - updated skills ${updatedSkill}`);

    // *********** Populate profils
    const profilsData = getAccessData();
    let createdProfil = 0;
    let updatedProfil = 0;
    for (let incr = 0 ; incr < profilsData.length ; incr++) {
        const profilToCreateOrUpdate = profilsData[incr];
        const existeProfil = await Access.findOne({profil: profilToCreateOrUpdate.profil});
        if (existeProfil) {
            existeProfil.navbar = profilToCreateOrUpdate.navbar;
            existeProfil.dashboards = profilToCreateOrUpdate.dashboards;
            existeProfil.pxx = profilToCreateOrUpdate.pxx;
            existeProfil.api = profilToCreateOrUpdate.api;
            await existeProfil.save();
            updatedProfil += 1;
            console.log(`[update] profil > ${profilToCreateOrUpdate.profil}`);
        } else {
            await Access.create(profilToCreateOrUpdate);
            createdProfil += 1;
            console.log(`[create] profil > ${profilToCreateOrUpdate.profil}`);
        }
    }
    console.log(`[result] created profil: ${createdProfil} - updated skills ${updatedProfil}`);


    const adminId = (await Access.findOne({profil: 'admin'}))._id;
    const coordinatorId = (await Access.findOne({profil: 'coordinator'}))._id;
    const cdmId = (await Access.findOne({profil: 'cdm'}))._id;
    const consId = (await Access.findOne({profil: 'consultant'}))._id;

    console.log(`Profil data created: 
        - admin_id = ${adminId}
        - coordinator_id = ${coordinatorId}
        - cdm_id = ${cdmId}
        - consultant_id =${consId} `);
    
    // *********** Populate consultants
    let sendCredentialOption = false;
    if (sendCredentialMessage.match(/^y|^yes/i)) {
        sendCredentialOption = true;
    }
    let sendTestAdress = true;
    if (sendTestAdressMessage.match(/^y|^yes/i)) {
        sendTestAdress = true;
    }
    if (sendTestAdressMessage.match(/^n|^no/i)) {
        sendTestAdress = false;
    }

    const { message: messageConsultantsFirst } = await getConsultantDataFromWk(wkDirectory + wkFileName, practice, {cdmId, consId, adminId}, userScope, sendCredentialOption, sendTestAdress);
    console.log(messageConsultantsFirst);
    // Again to match consultant and CDM   
    const { message: messageConsultantsSecond } = await getConsultantDataFromWk(wkDirectory + wkFileName, practice, {cdmId, consId, adminId}, userScope, false, sendTestAdress);
    console.log(messageConsultantsSecond);

    // Populate client

    //const { data, message:messageClient } = await initClient();
    const clientsData = initClient();
    let createdClient = 0;
    let updatedClient = 0;
    for (let incr = 0 ; incr < clientsData.length ; incr++) {
        const clientToCreateOrUpdate = clientsData[incr];
        const existeClient = await Client.findOne({name: clientToCreateOrUpdate.name});
        if (existeClient) {
            existeClient.commercialTeam = clientToCreateOrUpdate.commercialTeam;
            await existeClient.save();
            updatedClient += 1;
            console.log(`[update] client > ${clientToCreateOrUpdate.name}`);
        } else {
            await Client.create(clientToCreateOrUpdate);
            createdClient += 1;
            console.log(`[create] client > ${clientToCreateOrUpdate.name}`);
        }
    }

    // *********** Populate Pxx
    console.log('Start creating Pxx');
    await controleAndCreatePxx(0);
    console.log('End creating Pxx');

}

const deleteAndInitDataBase = async (option) => {

    try {
        if (option.delete) {
            await Skill.deleteMany();
            await Access.deleteMany();
            await Consultant.deleteMany();
            await User.deleteMany();
            await Pxx.deleteMany();
            await Client.deleteMany();
            console.log('Data deleted')
        }

        await updateDb();

        process.exit();
        
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}


if (process.argv[2] === '-d') {
    destroyData();
} else if (process.argv[2] === '-iprofil') {
    profilImport();
} else if (process.argv[2] === '-uprofil') {
    profilUpdate();
} else if (process.argv[2] === '-uclient') {
    clientUpdate();
} else if (process.argv[2] === '-deleteAndInitDb') {

    const confirm = prompt(`CURRENT ENV: ${process.env.NODE_ENV}\n\nDo you want to continue? (y/n) >`);
    if (confirm === 'n') {
        process.exit(0);
    }
    const deleteOption = wkFileName = prompt('Do you want to delete existing data ? (y/n) > ');
    if (deleteOption.match(/^y|^yes/i)) {
        deleteAndInitDataBase({delete: true});
    } else {
        deleteAndInitDataBase({delete: false});
    }
} else {
    importData();
}