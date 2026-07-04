const { Events } = require('discord.js')

module.exports = {
    name: Events.ClientReady,
	once: true,
    async execute(client) { 
        console.log(`Sesión iniciada como ${client.user.tag}`.brightCyan)
    
        if(client?.application?.commands){
            client.application.commands.set(client.commandsArray)
            console.log(`${client.commands.size} Comandos publicados 😎`.white)
        }
    }
}