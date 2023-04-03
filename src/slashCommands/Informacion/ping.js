const {SlashCommandBuilder,EmbedBuilder} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Ping de Toffu"),

    async execute(client, interaction, prefix){
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOR)
                    .setDescription(`Ping de ${client.ws.ping}ms`)
            ]
        })
    }
} 