const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');

const monthPxxRoutes = require('./routes/monthPxxRoutes');
const pxxRoutes = require('./routes/pxxRoutes');
const userRoutes = require('./routes/userRoutes');
const consultantRoutes = require('./routes/consultantRoutes');

const bodyParser = require('body-parser');
const connectDB = require('./config/db');

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
app.use(helmet());

app.use('/api/users', userRoutes);
app.use('/api/monthdata', monthPxxRoutes);
app.use('/api/pxx', pxxRoutes);
app.use('/api/consultants', consultantRoutes);

// static route for developpement access to build repository
const __dir = path.resolve();
//console.log(process)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dir, '/frontend/build')));
    // default request for route for request not describe above
    app.get('*', (req, res) => res.sendFile(path.resolve(__dir, 'frontend', 'build', 'index.html')))
} else {
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}

module.exports = app;