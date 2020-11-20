const express = require('express');
const monthPxxRoutes = require('./routes/monthPxx');
const bodyParser = require('body-parser');

const app = express();

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/api/monthdata', monthPxxRoutes);

module.exports = app;