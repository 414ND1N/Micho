const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    execute(message) { 
        if (message.guild) return
        console.log('DM recibido:'.white)
        console.log(`${message.content}`.yellow)
    }
}