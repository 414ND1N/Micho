const { EmbedBuilder } = require('discord.js')
const { COLOR_ERROR } = require('@/config')

module.exports.ErrorEmbed = async () => {
    return (
        new EmbedBuilder()
            .setTitle('No se ha recibido respuesta')
            .setColor(Number(COLOR_ERROR))
            .setDescription('No se ha recibido respuesta\nInténtalo de nuevo.')
            .setThumbnail('https://i.imgur.com/rIPXKFQ.png')
            .setTimestamp()
    )
}

module.exports.safeDefer = async (interaction, opts = {}) => {
    if (interaction.deferred || interaction.replied) return

    try {
        await interaction.deferReply(opts)
    }catch (err) {
        if (err?.code && (err.code === 10062 || err.code === 40060)) return
        throw err
    }
}

module.exports.safeRespond = async (interaction, payload) => {
    try {
        if (interaction.deferred || interaction.replied) {
            return await interaction.editReply(payload)
        }
        return await interaction.reply(payload)
    } catch (err) {
        if (err?.code && (err.code === 10062 || err.code === 40060)) {
            try {
                return await interaction.followUp(payload)
            } catch {
                return null
            }
        }
        throw err
    }
}