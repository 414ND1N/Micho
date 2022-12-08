const {EmbedBuilder} = require('discord.js')
module.exports = {
    DESCRIPTION: "Sirve para ver el ping del botsito",
    async execute(client, message, args, prefix){
        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOR)
                    .setDescription(`Ping de ${client.ws.ping}ms`)
            ]
        })
    }
}

