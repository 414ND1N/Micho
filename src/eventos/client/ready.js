const { Events } = require('discord.js')
const Database = require('@/database/db')

module.exports = {
    name: Events.ClientReady,
	once: true,
    async execute(client) { 
        console.log(`Sesión iniciada como ${client.user.tag}`.brightCyan)
    
        if(client?.application?.commands){
            client.application.commands.set(client.commandsArray)
            console.log(`${client.commands.size} Comandos publicados 😎`.white)
        }

        try {
            Database.initialize()
            console.log('Conectado a la base de datos 🗄️'.brightGreen)
        } catch (err) {
            console.log('Error al conectar a la base de datos ❌'.brightRed)
            console.log(err)
        }

    }
}