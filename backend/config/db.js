const mongoose = require('mongoose');

const connectDB = async () => {

    const uri = process.env.MONGO_TARGET === 'docker' ? process.env.MONGO_URI_LOCAL : process.env.MONGO_URI 
    //mongoose.connect(process.env.MONGO_URI, {
    //console.log('database loacation: ' + uri);
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

require('../models/monthModel');
require('../models/pxxModel');
require('../models/userModel');
require('../models/skillModels');
require('../models/accessModel');
require('../models/dealModel');
require('../models/consultantModel');
require('../models/taceModel');

module.exports = connectDB;