const {SlashCommandBuilder,EmbedBuilder} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription(`Ping de ${process.env.BOT_NAME}`),

    async execute(client, interaction){
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOR)
                    .setDescription(`Ping de ${client.ws.ping}ms`)
            ]
        })
    }
} 