const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { FORTUNE_OPTIONS } = require('@/config')
const { FORTUNE_COOKIE } = require('@/images')

module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("fortuna")
        .setNameLocalizations({
            "en-US": "fortune"
        })
        .setDescription("Mensaje de la galleta de la fortuna")
        .setDescriptionLocalizations({
            "en-US": "Fortune cookie message"
        }),
    async execute(interaction) {
        
        // frase de la galleta de la suerte
        const randomIndex = Math.floor(Math.random() * FORTUNE_OPTIONS.length)
        const item = FORTUNE_OPTIONS[randomIndex]

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${interaction.user?.username} pregunto su fortuna`)
                    .setColor("Random")
                    .setThumbnail(FORTUNE_COOKIE)
                    .setDescription(`**Tu fortuna es:**\n \`${item}\``)
            ]
        })
    }
}