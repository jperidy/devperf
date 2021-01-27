const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Month = require('./models/monthModel');
const User = require('./models/userModel');
const Consultant = require('./models/consultantModel')
const Pxx = require('./models/pxxModel');
const Skill = require('./models/skillModels');
const Deal = require('./models/dealModel');
const connectDB = require('./config/db');

const {getConsultantData, getCDMData} = require('./data/consultantData');
const { getUserData } = require('./data/userData');
const { getSkills } = require('./data/skillData');
const { getDeals } = require('./data/dealsData');
const { controleAndCreatePxx } = require('./controllers/cronJobsControllers');
const Access = require('./models/accessModel');
const { getAccessData } = require('./data/accessData');

dotenv.config();
connectDB();

const importData = async () => {
    
    // DELETE ALL CURRENT DATA
    try {
        
        await User.deleteMany();
        await Month.deleteMany();
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
        
        let ptc = 'PTC1';
        let cdmData = getCDMData(nbCdm, skillsDataCreated, ptc);
        let cdmDataCreated = await Consultant.insertMany(cdmData);

        let cdmId = cdmDataCreated.map( x => x.practice === ptc && x._id);
        let consultantData = getConsultantData(nbConsultants, cdmId, skillsDataCreated, ptc);
        let consultantDataCreated = await Consultant.insertMany(consultantData);

        let allConsultants = await Consultant.find({practice: ptc});
        let userData = getUserData(allConsultants);
        let userDataCreated = await User.insertMany(userData);


        ptc = 'PTC2';
        cdmData = getCDMData(nbCdm, skillsDataCreated, ptc);
        cdmDataCreated = await Consultant.insertMany(cdmData);

        cdmId = cdmDataCreated.map( x => x.practice === ptc && x._id);
        consultantData = getConsultantData(nbConsultants, cdmId, skillsDataCreated, ptc);
        consultantDataCreated = await Consultant.insertMany(consultantData);

        allConsultants = await Consultant.find({practice: ptc});
        userData = getUserData(allConsultants);
        userDataCreated = await User.insertMany(userData);

        ptc = 'PTC3';
        cdmData = getCDMData(nbCdm, skillsDataCreated, ptc);
        cdmDataCreated = await Consultant.insertMany(cdmData);

        cdmId = cdmDataCreated.map( x => x.practice === ptc && x._id);
        consultantData = getConsultantData(nbConsultants, cdmId, skillsDataCreated, ptc);
        consultantDataCreated = await Consultant.insertMany(consultantData);

        allConsultants = await Consultant.find({practice: ptc});
        userData = getUserData(allConsultants);
        userDataCreated = await User.insertMany(userData);

        
        ptc = 'PTC4';
        cdmData = getCDMData(nbCdm, skillsDataCreated, ptc);
        cdmDataCreated = await Consultant.insertMany(cdmData);
        
        cdmId = cdmDataCreated.map( x => x.practice === ptc && x._id);
        consultantData = getConsultantData(nbConsultants, cdmId, skillsDataCreated, ptc);
        consultantDataCreated = await Consultant.insertMany(consultantData);
        
        allConsultants = await Consultant.find({practice: ptc});
        userData = getUserData(allConsultants);
        userDataCreated = await User.insertMany(userData);

        let allFinalConsultants = await Consultant.find();
        allFinalConsultants = allFinalConsultants.filter(x => ['Senior consultant', 'Manager', 'Senior manager', 'Director', 'Partner'].includes(x.grade));

        const nbDeals = 200;
        let practices = allFinalConsultants.map(x => x.practice);
        practices = [... new Set(practices)];
        dealsData = getDeals(nbDeals, allFinalConsultants, practices);
        dealsDataCreated = await Deal.insertMany(dealsData);

        console.log(new Date(Date.now()).toISOString() + ': ControleAndCreatePxx running >>> start');
        await controleAndCreatePxx();

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
        await Skill.deleteMany
        
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
                searchProfil.navbar = profilData[incr].navbar;
                searchProfil.dashboards = profilData[incr].dashboards;
                searchProfil.pxx = profilData[incr].pxx;
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

if (process.argv[2] === '-d') {
    destroyData();
} else if (process.argv[2] === '-iprofil') {
    profilImport();
} else if (process.argv[2] === '-uprofil') {
    profilUpdate();
} else {
    importData();
}