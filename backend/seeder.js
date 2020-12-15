const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Month = require('./models/monthModel');
const User = require('./models/userModel');
const Consultant = require('./models/consultantModel')
const Pxx = require('./models/pxxModel');
const connectDB = require('./config/db');

//const getMonthData = require('./data/monthData');
//const getPxxData = require('./data/pxxData');
const {getConsultantData, getCDMData} = require('./data/consultantData');
const { getUserData } = require('./data/userData');

dotenv.config();
connectDB();

const importData = async () => {

    
    
    // DELETE ALL CURRENT DATA
    try {
        
        await User.deleteMany();
        await Month.deleteMany();
        await Pxx.deleteMany();
        await Consultant.deleteMany();
        
        console.log('Data deleted');
        
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
    
    // CREATE NEW DATASET

    //const startDate = new Date('2019-10-11');
    //const endDate = new Date('2021-04-27');
    const nbUsers = 20;
    const nbCdm = 5;

    // import default month data
    const cdmData = getCDMData(nbCdm);
    //const monthData = await getMonthData(startDate, endDate);

    try {
        //const monthDataCreated = await Month.insertMany(monthData);
        
        const cdmDataCreated = await Consultant.insertMany(cdmData);
        const cdmId = cdmDataCreated.map( x => x._id)
        const consultantData = getConsultantData(nbUsers, cdmId);
        const consultantDataCreated = await Consultant.insertMany(consultantData);

        const allConsultants = await Consultant.find();
        const userData = getUserData(allConsultants);
        const userDataCreated = await User.insertMany(userData);

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
        
        console.log('Data deleted');
        
    } catch (error) {
        console.error(error)
        process.exit(1)
    }

}

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}