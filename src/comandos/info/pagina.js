const {EmbedBuilder} = require('discord.js')
module.exports = {
    DESCRIPTION: "Muestra el link de la pana página",
    async execute(client, message, args, prefix){
        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOR)
                    .setDescription('La pana página esta disponible en **https://www.onanibando.ml/**')
            ]
        })
    }
}
