const dotenv = require('dotenv');
dotenv.config();

const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const proxy = require('express-http-proxy')

const app = express();

app.use(morgan('common'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json({limit: '50mb', extended: true})); // to upload consequent files

app.use('/api', proxy(process.env.PROXY_URL, { proxyReqPathResolver: function(req) { return '/api' + req.url} }));

const __dir = path.resolve();
app.use(express.static(path.join(__dir, '/react-app/build')));
app.get('*', (req, res) => res.sendFile(path.resolve(__dir, 'react-app', 'build', 'index.html')));

const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
const PORT = normalizePort(process.env.PORT || 3000);
app.set('port', PORT);

const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + PORT;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + PORT;
  console.log(`Listening on ${bind} in production mode`);
});

server.listen(PORT);