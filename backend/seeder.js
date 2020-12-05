const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Month = require('./models/monthModel');
const User = require('./models/userModel');
const Pxx = require('./models/pxxModel');
const connectDB = require('./config/db');

const getMonthData = require('./data/monthData');
const getPxxData = require('./data/pxxData');
const {getUserData, getCDMData} = require('./data/userData');

dotenv.config();
connectDB();

const importData = async () => {

    const startDate = new Date('2019-10-11');
    const endDate = new Date('2021-02-27');
    const nbUsers = 20;
    const nbCdm = 3;

    // import default month data
    const cdmData = getCDMData(nbCdm);
    const monthData = await getMonthData(startDate, endDate);

    
    
    // DELETE ALL CURRENT DATA
    try {
        
        await User.deleteMany();
        await Month.deleteMany();
        await Pxx.deleteMany();
        
        console.log('Data deleted');
        
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
    
    // CREATE NEW DATASET

    try {
        const monthDataCreated = await Month.insertMany(monthData);
        
        const cdmDataCreated = await User.insertMany(cdmData);
        const cdmId = cdmDataCreated.map( x => x._id)
        
        const userData = getUserData(nbUsers, cdmId);

        const userDataCreated = await User.insertMany(userData);

        const userDataAllCreated = await User.find();

        const pxxData = getPxxData(monthDataCreated, userDataAllCreated);
    
        await Pxx.insertMany(pxxData);

        console.log('Data imported')
        process.exit();
        
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

const destroyData = async () => {
    await Month.deleteMany()
        .then(() => {
            console.log('Month data deleted from MongoDB database');
            process.exit();
        })
        .catch((error) => {
            console.error(`Error when delete Month data from MongoDB data base : ${error}`);
            process.exit(1);
        });
}

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}