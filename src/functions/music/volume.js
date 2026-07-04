const { EmbedBuilder } = require('discord.js')
const { COLOR, COLOR_ERROR } = require('@/config')
const { ErrorEmbed } = require('@/utils/predifined_components')
const { PEEPO_SPEAKER } = require('@/images')

module.exports = async (interaction, queue, voiceChannel, desiredVolume) => {
    try {

        //Canal de Voz Cliente
        const clientChannel = interaction.guild.members.me.voice.channel.id

        //Verificar si existe un canal de voz
        if (!voiceChannel) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLOR_ERROR)
                        .setDescription(`Tienes que estar en un canal de voz para ejecutar el comando`)
                ]
                , ephemeral: true
            })
        }

        //Verificar que haya una canción en reproducción
        if (!queue || !queue.currentTrack) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLOR_ERROR)
                        .setDescription(`No hay ninguna canción en reproducción para pausar`)
                ]
                , ephemeral: true
            })
        }

        //Verificar mismo canal de voz
        if (clientChannel != voiceChannel.id) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLOR_ERROR)
                        .setDescription(`Tienes que estar en el mismo canal de voz que yo para ejecutar el comando`)
                ]
                , ephemeral: true
            })
        }

        queue.node.setVolume(desiredVolume)

        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Volúmen música')
                    .setThumbnail(PEEPO_SPEAKER)
                    .setColor(COLOR)
                    .setDescription(`Se cambió el volumen de la música a \`${desiredVolume}%\` en el canal ${voiceChannel}`)
            ]
            , ephemeral: true
        })

    } catch (error) {
        console.log(`Error al cambiar el volumen de la música: ${error}`)
        return interaction.editReply({
            embeds: [ErrorEmbed(`Ocurrió un error al intentar cambiar el volumen de la música: ${error.message}`)]
            , ephemeral: true
        })
    }
}