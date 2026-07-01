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