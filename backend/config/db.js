const mongoose = require('mongoose');

const connectDB = async () => {
    mongoose.connect(process.env.MONGO_URI, {
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

require('../models/monthModel');
require('../models/pxxModel');
require('../models/userModel');
require('../models/skillModels');
require('../models/accessModel');
require('../models/dealModel');
require('../models/consultantModel');
require('../models/taceModel');

/*

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })

        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error: ${error.message}`)
        process.exit(1)
    }
};

*/

module.exports = connectDB;