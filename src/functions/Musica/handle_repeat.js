const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js')

// musicCommands.js
module.exports = async (interaction, client, VOICE_CHANNEL) => {

    try {

        if(!interaction || !client || !VOICE_CHANNEL) throw new Error('Faltan argumentos o no son válidos')

        await interaction.deferReply({ ephemeral: true })

        // Botones
        const row = new ActionRowBuilder().addComponents(
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
        const msg = await interaction.editReply({
            embeds: [ 
                new EmbedBuilder()
                    .setTitle(`Controla la canción en reproducción`)
                    .setColor(process.env.COLOR)
                    .setThumbnail('https://i.imgur.com/bDO4VTw.gif')
                    .addFields(
                        { name: `🔂 Repetir canción actual`, value: `Repetir la canción actual` },
                        { name: `🔁 Repetir lista completa`, value: `Repetir la cola completa` },
                        { name: `❌ Desactivar repetición`, value: `Desactiva la repetición de la música o cola` },
                        { name: `🚪 Salir`, value: `Cerrar el menú de control` },
                    )
            ],
            components: [row],
            ephemeral: true,
            fetchReply: true
        })

        //Creacion del filter
        const filter = msg.createMessageComponentCollector({ 
            ComponentType: ComponentType.Button,
            time: 10000
        })
        
        filter.on("collect", async (b) => {
            if (b?.user.id != interaction.user.id) {
                return await b.reply({ 
                    content: `❌ Solo quien uso el comando puede navegar entre categorías.`, 
                    ephemeral: true 
                })
            }

            await b.deferUpdate()

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
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(process.env.COLOR)
                                .setDescription(`Repetición de la música establecida en \`${modo_rep}\``)
                        ],
                        components: [],
                        ephemeral: true
                    })
                    filter.resetTimer()
                    break
                case 'exit':
                    // Finalizar el filter
                    filter.stop()
            }
        })
        filter.on("end", async () => {
            // Borrar mensaje
            interaction.deleteReply()
        })
    } catch (error) {
        console.error(error)
        // Borrar mensajes
        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOR_ERROR)
                    .setDescription(`Ocurrió un error al mostrar el menú de repetición`)
            ],
            components: [],
            ephemeral: true
        })
    }
}
