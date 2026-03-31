const { EmbedBuilder } = require('discord.js')

module.exports.ErrorEmbed = async () => {
    return (
        new EmbedBuilder()
            .setTitle('No se ha recibido respuesta')
            .setColor(Number(process.env.COLOR_ERROR))
            .setDescription('No se ha recibido respuesta\nInténtalo de nuevo.')
            .setThumbnail('https://i.imgur.com/rIPXKFQ.png')
            .setTimestamp()
    )
}