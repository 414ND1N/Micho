const {SlashCommandBuilder} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Sirve para ver  el ping del botsito"),

    async execute(client, interaction, prefix){
        return interaction.reply(`\`Ping de ${client.ws.ping}ms 🧐\``)
    }
} 