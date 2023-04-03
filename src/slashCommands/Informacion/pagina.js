const { SlashCommandBuilder,EmbedBuilder} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Enlace de la pana página"),

    async execute(client, interaction, prefix){
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOR)
                    .setDescription('La pana página esta disponible en:\n **https://www.onanibando.ml/**')
                    .setThumbnail('https://i.imgur.com/9Kvn6Ym.png')
            ]
        })
    }
} 