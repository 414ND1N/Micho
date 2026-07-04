const { EmbedBuilder } = require('discord.js')
const { QueueRepeatMode } = require('discord-player');
const { COLOR, COLOR_ERROR } = require('@/config')
const { ErrorEmbed } = require('@/utils/predifined_components')
const { PEEPO_DISCO} = require('@/images')

module.exports = async (interaction, queue, voiceChannel, loopType) => {
    try {
        

        let selectedLoopType = QueueRepeatMode.TRACK
        if (loopType === 'queue') {
            selectedLoopType = QueueRepeatMode.QUEUE
        } else if (loopType === 'off') {
            selectedLoopType = QueueRepeatMode.OFF
        } else if (loopType === 'autoplay') {
            selectedLoopType = QueueRepeatMode.AUTOPLAY
        }

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

        queue.setRepeatMode(selectedLoopType)
        
        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Bucle música')
                    .setThumbnail(PEEPO_DISCO)
                    .setColor(COLOR)
                    .setDescription(`Se cambió el bucle de la música en el canal ${voiceChannel}`)
            ]
            , ephemeral: true
        })

    } catch (error) {
        return interaction.editReply({
            embeds: [ErrorEmbed('Ocurrió un error al cambiar el bucle de la música')]
            , ephemeral: true
        })
    }
}