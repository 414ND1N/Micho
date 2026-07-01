const {SlashCommandBuilder,EmbedBuilder} = require('discord.js')
const { COLOR, COLOR_ERROR, BOT_NAME } = require('@/config')

module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("ping")
        .setDescription(`Ping de ${BOT_NAME}`)
        .setDescriptionLocalizations({
            "en-US": `Ping of ${BOT_NAME}`
        })
    ,
    async execute(interaction){

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(COLOR)
                    .setDescription(`Ping de ${interaction.client.ws.ping}ms`)
            ]
        })
    }
} 