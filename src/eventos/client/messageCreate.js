const { Events } = require('discord.js');
const handleOpenaiChat  = require('../../functions/ChatAI/handle_openai_chat')

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {

        if (message.author.bot) return //Si el es bot no hacer nada

        if (message.guild) { // Mensaje enviado en un servidor
            return handleOpenaiChat(message)
        }

        // Mensaje enviado por un usuario al bot por DM
        console.log(`DM: ${message.content}`.yellow)

        // Responder al mensaje
        await message.channel.sendTyping()
        message.reply(process.env.RESPUESTA_DM)
    }
}


