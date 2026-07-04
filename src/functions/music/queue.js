const { EmbedBuilder } = require('discord.js')
const { COLOR, COLOR_ERROR } = require('@/config')
const { useHistory } = require('discord-player')
const buttonPagination = require('@/utils/button_pagination')
const { ErrorEmbed } = require('@/utils/predifined_components')

module.exports = async (interaction, queue, voiceChannel, queueType) => {
    try {
        //Canal de Voz Cliente
        const clientChannel = interaction.guild.members.me.voice.channel?.id

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
        
        if (clientChannel != voiceChannel?.id) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLOR_ERROR)
                        .setDescription(`Tienes que estar en el mismo canal de voz que yo para ejecutar el comando`)
                ]
                , ephemeral: true
            })
            
        }

        // Verificar si hay canciones en la cola
        let songsData = []
        if (queueType === 'current') {
            if (!queue || !queue.tracks || !queue.tracks.size) {

                if (!queue.currentTrack) {
                    return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(COLOR_ERROR)
                                .setDescription(`No hay canciones en la cola para mostrar`)
                        ]
                        , ephemeral: true
                    })
                } else {
                    return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`🎶 Canción en reproducción`)
                                .setColor(COLOR)
                                .setDescription(`**[${queue.currentTrack.title}](${queue.currentTrack.url})** ~ [${queue.currentTrack.requestedBy.toString()}]`)
                        ]
                        , ephemeral: true
                    })
                }
            }
            songsData = queue.tracks.toArray()
        } else {
            const history = useHistory(interaction.guildId)
            if (!history || !history.tracks || !history.tracks.size) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(COLOR_ERROR)
                            .setDescription(`No hay canciones en el historial para mostrar`)
                    ]
                    , ephemeral: true
                })
            }
            songsData = history.tracks.toArray()
        }

        if (!songsData.length) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLOR_ERROR)
                        .setDescription(`No hay canciones en la cola para mostrar`)
                ]
                , ephemeral: true
            })
        }

        const itemsPerPage = 10
        const maxPage = Math.ceil(songsData.length / itemsPerPage)

        const embeds = []
        for (let page = 0; page < maxPage; page++) {
            const start = page * itemsPerPage
            const end = Math.min(start + itemsPerPage, songsData.length)
            const tracks = songsData.slice(start, end)

            const embed = new EmbedBuilder()
                .setTitle(`🎶  Cola de reproducción - \`[${queue.tracks.size} ${queue.tracks.size > 1 ? "canciones" : "canción"}]\``)
                .setColor(COLOR)
                .setDescription(
                    tracks
                        .map((track, index) => `**${start + index + 1}**. [${track.title}](${track.url}) ~ [${track.requestedBy.toString()}]`)
                        .join('\n')
                )
            if (queue.tracks.size > 1) embed.addFields({ name: `🎧 Canción actual`, value: `**[${queue.currentTrack.title}](${queue.currentTrack.url})**` })
            embeds.push(embed)
        }

        await buttonPagination(interaction, embeds, 45_000)
    } catch (error) {
        console.log(`Error al mostrar la cola de reproducción: ${error}`)
        return interaction.editReply({
            embeds: [ErrorEmbed('Ocurrió un error al mostrar la cola de reproducción')]
            , ephemeral: true
        })
    }
}