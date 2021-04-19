const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Month = require('./models/monthModel');
const User = require('./models/userModel');
const Consultant = require('./models/consultantModel');
const Pxx = require('./models/pxxModel');
const Skill = require('./models/skillModels');
const Deal = require('./models/dealModel');
//const connectDB = require('./config/db');

const connectDB = async () => {
    
    let uri = process.env.MONGO_URI.replace('@mongodb:27017', '@localhost:27017');
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
const Access = require('./models/accessModel');
const { getAccessData } = require('./data/accessData');
const { getClient, initClient } = require('./data/clientData');
const Client = require('./models/clientModel');

dotenv.config();

connectDB(process.env.MONGO_URI.replace('@mongodb:27017', '@localhost:27017'));

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
                //searchProfil.navbar = profilData[incr].navbar;
                //searchProfil.dashboards = profilData[incr].dashboards;
                //searchProfil.pxx = profilData[incr].pxx;
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

const initDataBase = async () => {

    try {

        await Skill.deleteMany();
        await Consultant.deleteMany();
        await User.deleteMany();
        await Pxx.deleteMany();
        await Client.deleteMany();
        console.log('Data deleted')

        // Populate skills
        const skillsData = getSkills();
        const skillsDataCreated = await Skill.insertMany(skillsData);
        console.log('Skills created: ' + skillsDataCreated.length);

        // Populate profils
        const profilData = getAccessData();
        const profilDataCreated = await Access.insertMany(profilData);
        const adminId = profilDataCreated.filter( x => x.profil === 'admin')[0]._id;
        const coordinatorId = profilDataCreated.filter( x => x.profil === 'coordinator')[0]._id;
        const cdmId = profilDataCreated.filter( x => x.profil === 'cdm')[0]._id;

        console.log(`Profil data created: 
            - admin_id = ${adminId}
            - coordinator_id = ${coordinatorId}
            - cdm_id = ${cdmId}`);
        
        // Populate consultants
        const { message: messageConsultantsFirst } = await getConsultantDataFromWk('hr.presence.xlsx', 'DET', cdmId);
        console.log(messageConsultantsFirst);
        // Again to match consultant and CDM   
        const { message: messageConsultantsSecond } = await getConsultantDataFromWk('hr.presence.xlsx', 'DET', cdmId);
        console.log(messageConsultantsSecond);

        // Populate client
        const { data, message:messageClient } = await initClient();
        console.log(messageClient);

        // Populate Pxx
        console.log('Start creating Pxx');
        await controleAndCreatePxx(0);
        console.log('End creating Pxx');

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
} else if (process.argv[2] === '-initDb') {
    initDataBase();
} else {
    importData();
}