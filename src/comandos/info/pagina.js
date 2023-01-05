const {EmbedBuilder} = require('discord.js')
module.exports = {
    ALIASES: ["panapagina", "page"],
    DESCRIPTION: "Muestra el link de la pana página",
    async execute(client, message, args, prefix){
        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOR)
                    .setDescription('La pana página esta disponible en:\n **https://www.onanibando.ml/**')
                    .setThumbnail('https://i.imgur.com/9Kvn6Ym.png')
            ]
        })
    }
}
