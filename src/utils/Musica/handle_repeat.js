const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

// musicCommands.js
const handleMusicRepeat = async (interaction, client, VOICE_CHANNEL) => {

    try {
        // Creacion de los embed
        const embed_repeticion = new EmbedBuilder()
            .setTitle(`Controla la canción en reproducción`)
            .setColor(process.env.COLOR)
            .setThumbnail('https://i.imgur.com/bDO4VTw.gif')
            .addFields(
                { name: `🔂 Repetir canción actual`, value: `Repetir la canción actual` },
                { name: `🔁 Repetir lista completa`, value: `Repetir la cola completa` },
                { name: `❌ Desactivar repetición`, value: `Desactiva la repetición de la música o cola` },
                { name: `🚪 Salir`, value: `Cerrar el menú de control` },
            )

        // Botones
        const row_repeticion = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setEmoji('🔂')
                .setCustomId('rep_actual')
                .setStyle(ButtonStyle.Primary)
            ,
            new ButtonBuilder()
                .setEmoji('🔁')
                .setCustomId('rep_lista')
                .setStyle(ButtonStyle.Primary)
            ,
            new ButtonBuilder()
                .setEmoji('❌')
                .setCustomId('rep_no')
                .setStyle(ButtonStyle.Danger)
            ,
            new ButtonBuilder()
                .setEmoji('🚪')
                .setCustomId('exit')
                .setStyle(ButtonStyle.Success)

        )

        //Creacion del Embed principal
        let embed_music_repeticion = await interaction.channel.send({
            embeds: [embed_repeticion],
            components: [row_repeticion],
            ephemeral: true
        })

        //Creacion del collector
        const collector = embed_music_repeticion.createMessageComponentCollector({ time: 18e3 }) //18 segundos de tiempo de espera
        collector.on("collect", async (b) => {
            if (b?.user.id != interaction.user.id) {
                return await b.reply({ content: `❌ Solo quien uso el comando puede navegar entre categorías.`, ephemeral: true })
            }

            switch (b.customId) {
                case 'rep_actual':
                case 'rep_lista':
                case 'rep_no':
                    let repeticion_value = 0
                    let modo_rep = ''
                    switch (b?.customId) {
                        case 'rep_actual':
                            repeticion_value = 1
                            modo_rep = "cancion actual"
                            break
                        case 'rep_lista':
                            repeticion_value = 2
                            modo_rep = "lista completa"
                            break
                        case 'rep_no':
                            repeticion_value = 0
                            modo_rep = "desactivado"
                            break
                    }

                    client.distube.setRepeatMode(VOICE_CHANNEL, repeticion_value)
                    collector.resetTimer()

                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Repetición cola música')
                                .setColor(process.env.COLOR)
                                .addFields({ name: `Se cambió la repetición a \`${modo_rep}\``, value: `🔄 🎶 🎵` })
                                .setThumbnail('https://i.imgur.com/Cm5hy47.gif')
                        ]
                    })
                    await b?.deferUpdate()
                    break

                case 'exit':
                    // Finalizar el collector
                    collector.stop()

            }

        })
        collector.on("end", async () => {
            //se actualiza el mensaje y se elimina la interacción
            embed_music_repeticion.edit({
                content: "", embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setThumbnail("https://i.imgur.com/DeMOi0v.gif")
                ], components: [], ephemeral: true
            }).catch(() => { })
            embed_music_repeticion.suppressEmbeds(true)
            await interaction.deleteReply()
            return
        })
    } catch (error) {
        console.error(error)
        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOR_ERROR)
                    .setDescription(`Ocurrió un error al mostrar el menú de control`)
            ]
            , ephemeral: true
        })
    }
}

module.exports = {
    handleMusicRepeat
};
