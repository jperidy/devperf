const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
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

const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const { controlAndCreateMonth, controleAndCreatePxx } = require('./controllers/cronJobsControllers');

const app = express();

if (process.env.NODE_ENV === 'development' ) {
    app.use(morgan('dev'));
}

connectDB();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

//app.use(helmet());

app.use('/api/users', userRoutes);
app.use('/api/monthdata', monthPxxRoutes);
app.use('/api/pxx', pxxRoutes);
app.use('/api/consultants', consultantRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/access', accessRoutes);
app.use('/api/clients', clientRoutes);

// static route for developpement access to build repository
const __dir = path.resolve();
//console.log(process)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dir, '/frontend/build')));
    // default request for route for request not describe above
    app.get('*', (req, res) => res.sendFile(path.resolve(__dir, 'frontend', 'build', 'index.html')))
} else {
    //app.use(express.static(path.join(__dir, '/frontend/build')));
    //app.get('*', (req, res) => res.sendFile(path.resolve(__dir, 'frontend', 'build', 'index.html')))
    app.get('/', (req, res) => res.send('API is running...'));
}


// Declaration of cron tasks
cron.schedule('*/60 * * * *', () => {
    console.log(new Date(Date.now()).toISOString() + ': ControlAndCreateMonth running every 60 minutes');
    try {
        controlAndCreateMonth();
    } catch (error) {
        console.error(`${new Date(Date.now()).toISOString()} error with controlAndCreateMonth cron job: ${error}`);
    }
});

cron.schedule('*/30 * * * *', () => {
    console.log(new Date(Date.now()).toISOString() + ': ControleAndCreatePxx running every 30 minutes >>> start');
    try {
        controleAndCreatePxx();
    } catch (error) {
        console.error(`${new Date(Date.now()).toISOString()} error with controlAndCreatePxx cron job: ${error}`);
    }
});

module.exports = app;