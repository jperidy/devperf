const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cron = require('node-cron');

const monthPxxRoutes = require('./routes/monthPxxRoutes');
const pxxRoutes = require('./routes/pxxRoutes');
const userRoutes = require('./routes/userRoutes');
const consultantRoutes = require('./routes/consultantRoutes');
const skillsRoutes = require('./routes/skillsRoutes');
const dealRoutes = require('./routes/dealRoutes');
const accessRoutes = require('./routes/accessRoutes');
const clientRoutes = require('./routes/clientRoutes');
const taceRoutes = require('./routes/taceRoutes');
const emailsRoutes = require('./routes/emailRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const { controlAndCreateMonth, controleAndCreatePxx, deleteOldFiles, blockUserAccount } = require('./controllers/cronJobsControllers');

const app = express();

if (process.env.NODE_ENV === 'development' ) {
    app.use(morgan('dev'));
} else if (process.env.NODE_ENV === 'demo') {
    app.use(morgan('common'));
} else if (process.env.NODE_ENV === 'docker') {
    app.use(morgan('common'));
} else if (process.env.NODE_ENV === 'poc') {
    app.use(morgan('common'));
} else if (process.env.NODE_ENV === 'poc-ovh') {
    app.use(morgan('common'));
}

connectDB();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json({limit: '50mb', extended: true})); // to upload consequent files


app.use('/api/users', userRoutes);
app.use('/api/monthdata', monthPxxRoutes);
app.use('/api/pxx', pxxRoutes);
app.use('/api/consultants', consultantRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/access', accessRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/tace', taceRoutes);
app.use('/api/upload', uploadRoutes);

app.use('/api/emails', emailsRoutes);

// static route for developpement access to build repository
const __dir = path.resolve();

if (['demo', 'poc', 'docker', 'poc-ovh'].includes(process.env.NODE_ENV)) {
    app.use(express.static(path.join(__dir, '/frontend/build')));
    app.get('*', (req, res) => res.sendFile(path.resolve(__dir, 'frontend', 'build', 'index.html')))
} else {
    app.get('/', (req, res) => res.send(`API ${COMPOSE_VERSION} is running...`));
}


// Declaration of cron tasks
cron.schedule('0 1 2 1 * *', () => {
    console.log(new Date(Date.now()).toISOString() + ': Running ControlAndCreateMonth job at 02:01 the 1fst day of month');
    try {
        controlAndCreateMonth();
    } catch (error) {
        console.error(`${new Date(Date.now()).toISOString()} error with controlAndCreateMonth cron job: ${error}`);
    }
});

cron.schedule('0 1 1 * * *', () => {
    console.log(new Date(Date.now()).toISOString() + ': Running ControleAndCreatePxx job at 01:01 >>> start');
    try {
        controleAndCreatePxx(0);
    } catch (error) {
        console.error(`${new Date(Date.now()).toISOString()} error with controlAndCreatePxx cron job: ${error}`);
    }
});

cron.schedule('*/60 * * * *', () => {
    console.log(new Date(Date.now()).toISOString() + ': Running deleteOldFiles running every 60 minutes >>> start');
    try {
        deleteOldFiles();
    } catch (error) {
        console.error(`${new Date(Date.now()).toISOString()} error with deleteOldFiles cron job: ${error}`);
    }
});

cron.schedule('0 1 2 * * *', () => {
    console.log(new Date(Date.now()).toISOString() + ': Running blockUserAccount running at 02:01 >>> start');
    try {
        blockUserAccount();
    } catch (error) {
        console.error(`${new Date(Date.now()).toISOString()} error with blockUserAccount cron job: ${error}`);
    }
});

module.exports = app;