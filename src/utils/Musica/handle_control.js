const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

// musicCommands.js
const handleMusicControl = async (interaction, client, VOICE_CHANNEL, QUEUE, channel) => {

    // Creacion de los embed
    const embed_control = new EmbedBuilder()
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

    // Botones
    const row_control = new ActionRowBuilder().addComponents(
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
    let embed_music_control = await interaction.channel.send({
        embeds: [embed_control],
        components: [row_control],
        ephemeral: true
    })

    //Creacion del collector
    const collector = embed_music_control.createMessageComponentCollector({ time: 15e3 }) //15 segundos de tiempo de espera
    collector.on("collect", async (i) => {
        if (i?.user.id != interaction.user.id) {
            return await i.reply({ content: `❌ Solo quien uso el comando puede navegar entre categorías.`, ephemeral: true })
        }
        switch (i?.customId) {
            case 'mezclar': 
                client.distube.shuffle(VOICE_CHANNEL)
                collector.resetTimer()
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Mezcla lista música')
                            .setThumbnail('https://i.imgur.com/8L4WreH.gif')
                            .setColor(process.env.COLOR)
                            .addFields({ name: `Se mezcló la lista de música`, value: `🎶 😎👍` })
                    ]
                })
                await i?.deferUpdate()
                break
            
            case 'play': 
                if (QUEUE.paused) {
                    client.distube.resume(VOICE_CHANNEL)

                    collector.resetTimer()
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`Reanudar la música`)
                                .setThumbnail('https://i.imgur.com/9fBJ0s7.gif')
                                .setColor(process.env.COLOR)
                                .addFields({ name: `Se renaudó la música`, value: `🚦🛑` })
                        ]
                    })
                } else {
                    client.distube.pause(VOICE_CHANNEL)

                    collector.resetTimer()
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`Pausa de la música`)
                                .setThumbnail('https://i.imgur.com/kY0gh91.gif')
                                .setColor(process.env.COLOR)
                                .addFields({ name: `Se pausó la música`, value: `🚦🛑` })
                        ]
                    })
                }

                await i?.deferUpdate()
                break
            
            case 'siguiente': 
                if ((!QUEUE.autoplay && QUEUE.songs.length <= 1) || QUEUE.songs.length <= 1) { //Si no hay más canciones en la lista y no está activado el autoplay
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(process.env.COLOR_ERROR)
                                .setDescription(`No hay más música en la lista para reproducir`)
                        ]
                    })
                    break
                }
                client.distube.skip(VOICE_CHANNEL)
                collector.resetTimer()
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Siguiente música')
                            .setThumbnail('https://i.imgur.com/9fBJ0s7.gif')
                            .setColor(process.env.COLOR)
                            .addFields({ name: `Se saltó a la siguiente música`, value: `⏭ ⏭ ⏭ ` })
                    ]
                })
                await i?.deferUpdate()
                break
            
            case 'anterior': 
                client.distube.previous(VOICE_CHANNEL)
                collector.resetTimer()
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Música anterior')
                            .setThumbnail('https://i.imgur.com/9fBJ0s7.gif')
                            .setColor(process.env.COLOR)
                            .addFields({ name: `Se saltó a la canción anterior`, value: `⏮ ⏮ ⏮` })
                    ]
                })
                await i?.deferUpdate()
                break
            
            case 'exit': 
                collector.stop()
                break
            
        }

    })
    collector.on("end", async () => {
        //se actualiza el mensaje y se elimina la interacción
        embed_music_control.edit({
            content: "", embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOR)
                    .setThumbnail("https://i.imgur.com/DeMOi0v.gif")
            ], components: [], ephemeral: true
        }).catch(() => { })
        await interaction.deleteReply()
        embed_music_control.suppressEmbeds(true)
        return
    })
}

module.exports = {
    handleMusicControl
};
