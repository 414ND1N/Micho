const { SlashCommandBuilder,EmbedBuilder} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Repositorio de mi código ☺"),

    async execute(client, interaction, prefix){
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOR)
                    .setDescription(`Puedes encontrar mi código fuente en:\n ${process.env.URL_REPO}`)
                    .setThumbnail('https://i.imgur.com/zMV9yIP.png')
            ]
        })
    }
} 