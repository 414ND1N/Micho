const { EmbedBuilder } = require('discord.js')
const { COLOR, COLOR_ERROR } = require('@/config')

module.exports = async (interaction, queue, voiceChannel) => {
    try {

        //Canal de Voz Cliente
        const clientChannel = interaction.guild.members.me.voice.channel.id

        //Verificar si existe un canal de voz
        if (!voiceChannel) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLOR_ERROR)
                        .setDescription(`Tienes que estar en un canal de voz para ejecutar el comando 🤨`)
                ]
                , ephemeral: true
            })
        }

        //Verificar mismo canal de voz
        if (queue || queue.currentTrack) {
            if (clientChannel != voiceChannel.id) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(COLOR_ERROR)
                            .setDescription(`Tienes que estar en el mismo canal de voz que yo para ejecutar el comando 🤨`)
                    ]
                    , ephemeral: true
                })
            }
        }

        //Destruccion y Desconeccion.
        // Si hay una cola, limpiar las canciones
        if (queue.tracks.size) {
            queue.clear()
        }

        // Si hay una canción en reproducción, detenerla
        if (queue.currentTrack) {
            queue.node.stop()
        }
        queue.connection.disconnect()

        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Detener música')
                    .setThumbnail('https://i.imgur.com/WnsPmQz.gif')
                    .setColor(COLOR)
                    .setDescription(`Se detuvo la reproducción de música en el canal ${voiceChannel}`)
            ]
            , ephemeral: true
        })

    } catch (error) {
        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Detener música')
                    .setThumbnail('https://i.imgur.com/WHCwA6t.gif')
                    .setColor(COLOR_ERROR)
                    .setDescription(`No se pudo abandonar el canal de voz, por favor revisa mis permisos`)
            ]
            , ephemeral: true
        })
    }
}