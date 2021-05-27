const mongoose = require('mongoose');

const connectDB = async () => {
    
    let uri = '';
    
    if (['demo', 'development'].includes(process.env.NODE_ENV)) {
        uri = process.env.MONGO_URI_DEMO
    } else if (process.env.NODE_ENV === 'docker') {
        uri = process.env.MONGO_URI_DOCKER
    } else if (process.env.NODE_ENV === 'poc') {
        uri = process.env.MONGO_URI_POC
    } else if (process.env.NODE_ENV === 'poc-ovh') {
        uri = process.env.MONGO_URI_POC_OVH
    }

    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
        .then((conn) => console.log(`MongoDB connected: ${conn.connection.host}`))
        .catch((error) => {
            console.log(`Error: ${error.message} \nNODE_ENV:${process.env.NODE_ENV}\nuri: ${uri}`);
            process.exit(1);
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