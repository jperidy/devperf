const express = require('express');
const app = require('./app');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;
const ENVIRONMENT = process.env.NODE_ENV;

app.listen(PORT, console.log(`server running in ${ENVIRONMENT} on port ${PORT}`));