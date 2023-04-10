require('dotenv').config({ path: '.env.' + (process.env.NODE_ENV || 'development') });
const config = require('./src/config');
const Server = require('./src/server');

new Server(config.PORT).start();