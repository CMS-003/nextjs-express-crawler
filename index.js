require('dotenv').config({ path: '.env.' + (process.env.NODE_ENV || 'development') });
const Server = require('./src/server');

new Server(3000).start();