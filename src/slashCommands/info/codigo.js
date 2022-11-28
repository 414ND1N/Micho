const { SlashCommandBuilder} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Muestra el repositorio de mi código ☺"),

    async execute(client, interaction, prefix){
        return interaction.reply('Puedes encontrar mi código fuente en: https://github.com/414ND1N/Toffu.git')
    }
} 