const { SlashCommandBuilder} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Muestra el link de la pana página"),

    async execute(client, interaction, prefix){
        return interaction.reply('La pana página esta disponible en **https://www.onanibando.ml/**\n😎👍')
    }
} 