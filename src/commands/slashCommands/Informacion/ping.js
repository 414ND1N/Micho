const {SlashCommandBuilder,EmbedBuilder} = require('discord.js')

module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("ping")
        .setDescription(`Ping de ${process.env.BOT_NAME}`)
        .setDescriptionLocalizations({
            "en-US": `Ping of ${process.env.BOT_NAME}`
        })
    ,
    async execute(interaction){

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Number(process.env.COLOR))
                    .setDescription(`Ping de ${interaction.client.ws.ping}ms`)
            ]
        })
    }
} 