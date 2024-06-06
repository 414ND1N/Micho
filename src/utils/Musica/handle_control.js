const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js')

// musicCommands.js
module.exports = async (interaction, client, VOICE_CHANNEL, QUEUE) => {

    try {

        if (!interaction || !client || !VOICE_CHANNEL || !QUEUE) throw new Error('Faltan argumentos o no son válidos')

        await interaction.deferReply({ ephemeral: true })

        // Botones
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setEmoji('🔀')
                .setCustomId('mezclar')
                .setStyle(ButtonStyle.Success)
            ,
            new ButtonBuilder()
                .setEmoji('⏮')
                .setCustomId('anterior')
                .setStyle(ButtonStyle.Primary)
            ,
            new ButtonBuilder()
                .setEmoji('⏯')
                .setCustomId('play')
                .setStyle(ButtonStyle.Success)
            ,
            new ButtonBuilder()
                .setEmoji('⏭')
                .setCustomId('siguiente')
                .setStyle(ButtonStyle.Primary)
            ,
            new ButtonBuilder()
                .setEmoji('🚪')
                .setCustomId('exit')
                .setStyle(ButtonStyle.Danger)
        )

        //Creacion del Embed principal
        const msg = await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Controla la canción en reproducción`)
                    .setColor(process.env.COLOR)
                    .setThumbnail('https://i.imgur.com/bDO4VTw.gif')
                    .addFields(
                        { name: `⏮ Anterior canción`, value: `Reanuda la reproducción de la música actual` },
                        { name: `⏯ Resumir - Pausar reproducción`, value: `Reanuda la reproducción de la música actual` },
                        { name: `⏹ Detener reproducción`, value: `Detiene la reproducción de la música actual` },
                        { name: `🔀 Mezclar cola música`, value: `Mezcla la cola de reproducción` },
                        { name: `⏭ Siguiente canción`, value: `Reanuda la reproducción de la música actual` },
                    )
            ],
            components: [row],
            ephemeral: true,
            fetchReply: true
        })

        //Creacion del filter
        const filter = await msg.createMessageComponentCollector({
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
                case 'mezclar':
                    filter.resetTimer()
                    client.distube.shuffle(VOICE_CHANNEL)
                    break

                case 'play':
                    if (QUEUE.paused) {
                        filter.resetTimer()
                        client.distube.resume(VOICE_CHANNEL)
                    } else {
                        filter.resetTimer()
                        client.distube.pause(VOICE_CHANNEL)
                    }
                    break

                case 'siguiente':
                    if ((!QUEUE.autoplay && QUEUE.songs.length <= 1) || QUEUE.songs.length <= 1) { //Si no hay más canciones en la lista y no está activado el autoplay
                        break
                    }
                    filter.resetTimer()
                    client.distube.skip(VOICE_CHANNEL)
                    break

                case 'anterior':
                    filter.resetTimer()
                    client.distube.previous(VOICE_CHANNEL)
                    break
                case 'exit':
                    filter.stop()
            }
        })

        filter.on("end", async () => {
            // Borrar mensajes
            interaction.deleteReply()
        })
    } catch (error) {
        console.error(error)
        // Borrar mensajes
        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOR_ERROR)
                    .setDescription(`Ocurrió un error al mostrar el menú de control`)
            ],
            components: [],
            ephemeral: true
        })
    }
}

