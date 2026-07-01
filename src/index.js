require('module-alias/register');
require('dotenv').config();
require('colors');

const Bot = require('./structures/client.js');

new Bot();
