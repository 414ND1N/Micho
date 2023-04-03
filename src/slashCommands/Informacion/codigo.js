const { SlashCommandBuilder,EmbedBuilder} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Repositorio de mi código ☺"),

    async execute(client, interaction, prefix){
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOR)
                    .setDescription('Puedes encontrar mi código fuente en:\n https://github.com/414ND1N/Toffu.git')
                    .setThumbnail('https://i.imgur.com/zMV9yIP.png')
            ]
        })
    }
} 