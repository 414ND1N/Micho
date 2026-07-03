const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js')
const { COLOR, COLOR_ERROR } = require('@/config')
// const { useHistory } = require('discord-player')

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

        // Creacion de filtro
        const actionRows = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setEmoji('🔀')
                    .setCustomId('shuffle')
                    .setStyle(ButtonStyle.Success)
                ,
                new ButtonBuilder()
                    .setEmoji('⏯')
                    .setCustomId('playpause')
                    .setStyle(ButtonStyle.Success)
            )

        if (queue.tracks.size > 1 || queue.autoplay) {
            actionRows.addComponents(
                new ButtonBuilder()
                .setEmoji('⏭')
                .setCustomId('next')
                .setStyle(ButtonStyle.Primary)
            )
        }

        actionRows.addComponents(
            new ButtonBuilder()
                .setEmoji('🚪')
                .setCustomId('exit')
                .setStyle(ButtonStyle.Danger)
        )

        const menuEmbed = await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Controla la canción en reproducción`)
                    .setColor(COLOR)
                    .setThumbnail('https://i.imgur.com/bDO4VTw.gif')
                    .addFields(
                        { name: `⏮ Anterior canción`, value: `Reanuda la reproducción de la música actual` },
                        { name: `⏯ Resumir - Pausar reproducción`, value: `Reanuda la reproducción de la música actual` },
                        { name: `⏹ Detener reproducción`, value: `Detiene la reproducción de la música actual` },
                        { name: `🔀 Mezclar cola música`, value: `Mezcla la cola de reproducción` },
                        { name: `⏭ Siguiente canción`, value: `Reanuda la reproducción de la música actual` },
                    )
            ],
            components: [actionRows],
            ephemeral: true,
            fetchReply: true
        })
        const filter = await menuEmbed.createMessageComponentCollector({
            ComponentType: ComponentType.Button,
            time: 10000
        })

        filter.on("collect", async (i) => {

            if (i?.user.id != interaction.user.id) {
                return i?.reply({
                    content: `❌ Solo quien uso el comando puede navegar entre categorías.`,
                    ephemeral: true
                })
            }

            await i.deferUpdate()

            switch (i.customId) {
                case 'shuffle':
                    filter.resetTimer()
                    // Cancion en cola
                    if (!queue || !queue.currentTrack) {
                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(COLOR_ERROR)
                                    .setDescription(`No hay ninguna canción en reproducción para mezclar la cola`)
                            ]
                            , ephemeral: true
                        })
                    }

                    queue.tracks.shuffle()
                    break

                case 'playpause':
                    filter.resetTimer()
                    // Cancion en cola
                    if (!queue || !queue.currentTrack) {
                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(COLOR_ERROR)
                                    .setDescription(`No hay ninguna canción en reproducción para mezclar la cola`)
                            ]
                            , ephemeral: true
                        })
                    }

                    if (queue.node.isPaused()) {
                        queue.node.setPaused(false)
                    } else {
                        queue.node.setPaused(true)
                    }
                    break
                case 'next':

                    filter.resetTimer()
                    // Cancion en cola
                    if (!queue || !queue.currentTrack) {
                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(COLOR_ERROR)
                                    .setDescription(`No hay ninguna canción en reproducción para mezclar la cola`)
                            ]
                            , ephemeral: true
                        })
                    }

                    if ((!queue.autoplay && queue.tracks.size <= 1) || queue.tracks.size <= 1) { //Si no hay más canciones en la lista y no está activado el autoplay
                        break
                    }

                    queue.node.skip()

                    break

                case 'exit':
                    filter.stop()
                    break
            }
        })

        filter.on("end", async () => {
            // Borrar mensajes
            interaction.deleteReply()
        })

    } catch (error) {
        console.log(`Error al mostrar el menú de control: ${error}`)
        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(COLOR_ERROR)
                    .setDescription(`Ocurrió un error al mostrar el menú de control`)
            ],
            components: [],
            ephemeral: true
        })
    }
}