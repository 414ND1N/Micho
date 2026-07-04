const { EmbedBuilder } = require('discord.js')
const { COLOR_ERROR } = require('@/config')
const { PEEPO_DOUBT } = require('@/images')

module.exports.ErrorEmbed = async (error) => {
    return (
        new EmbedBuilder()
            .setTitle(error ?? 'No se ha recibido respuesta')
            .setColor(COLOR_ERROR)
            .setDescription('No se ha recibido respuesta\nInténtalo de nuevo.')
            .setThumbnail(PEEPO_DOUBT)
            .setTimestamp()
    )
}