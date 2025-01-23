const { Events } = require('discord.js');
// const handleOpenaiChat  = require('../../functions/ChatAI/handle_openai_chat')

module.exports = {
    name: Events.MessageCreate,
    execute(message) {
        if (message.guild) {
            // handleOpenaiChat(message)
            return
        }

        // Mensaje enviado por un usuario al bot por DM
        console.log('DM recibido:'.white)
        console.log(`${message.content}`.yellow)
    }
}


