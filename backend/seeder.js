const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Month = require('./models/monthModel');
const User = require('./models/userModel');
const Pxx = require('./models/pxxModel');
const connectDB = require('./config/db');

const getMonthData = require('./data/monthData');
const getPxxData = require('./data/pxxData');
const getUserData = require('./data/userData');

dotenv.config();
connectDB();

const importData = async () => {

    const startDate = new Date('2020-11-11');
    const endDate = new Date('2021-02-27');
    const nbUsers = 10;

    // import default month data
    const userData = getUserData(nbUsers);
    const monthData = await getMonthData(startDate, endDate);
    
    //console.log("userData", userData);
    //console.log('pxxData', pxxData);
    
    
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
    
        const userDataCreated = await User.insertMany(userData);
        
        //console.log('data', userDataCreated);

        const pxxData = getPxxData(monthDataCreated, userDataCreated);
    
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