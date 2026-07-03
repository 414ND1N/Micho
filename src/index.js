require('module-alias/register')
require('dotenv').config()
require('colors')
const dns = require ("node:dns/promises")
dns.setServers(["1.1.1.1"])

const Bot = require('@/structures/client.js')

new Bot()
