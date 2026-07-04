const { EmbedBuilder } = require('discord.js')
const { COLOR, COLOR_ERROR } = require('@/config')
const { ErrorEmbed } = require('@/utils/predifined_components')
const { PEEPO_OK } = require('@/images')

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
                        .setDescription(`Tienes que estar en un canal de voz para ejecutar el comando`)
                ]
                , ephemeral: true
            })
        }

        //Verificar mismo canal de voz
        if (!queue || !queue.currentTrack){
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLOR_ERROR)
                        .setDescription(`No hay música reproduciéndose actualmente`)
                ]
                , ephemeral: true
            })
        }
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

        // Si ya esta pausada la canción, no hacer nada
        if (queue.node.isPaused()) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLOR)
                        .setDescription(`La canción ya esta pausada`)
                ]
                , ephemeral: true
            })
        }

        queue.node.setPaused(true)

        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Pausar música')
                    .setThumbnail(PEEPO_OK)
                    .setColor(COLOR)
                    .setDescription(`Se pausó la reproducción de música en el canal ${voiceChannel}`)
            ]
            , ephemeral: true
        })

    } catch (error) {
        return interaction.editReply({
            embeds: [ErrorEmbed('Ocurrió un error al pausar la música')]
            , ephemeral: true
        })
    }
}