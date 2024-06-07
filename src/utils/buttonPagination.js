const {ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType} = require('discord.js')

module.exports = async (interaction, pages, pagination_time= 30_000) => {
    try {
        if(!interaction || !pages || !pages>0) throw new Error('Faltan argumentos o no son válidos')

        await interaction.deferReply()

        if (pages.length === 1) {
            return await interaction.editReply({
                embeds: [pages[0]],
                components: [],
                fetchReply: true,
                ephemeral: true
            })
        }

        const prev = new ButtonBuilder()
            .setCustomId('prev')
            .setStyle(ButtonStyle.Success)
            .setEmoji('⬅')
        
        const next = new ButtonBuilder()
            .setCustomId('next')
            .setStyle(ButtonStyle.Success)
            .setEmoji('➡')

        const home = new ButtonBuilder()
            .setCustomId('home')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🏠')

        const exit = new ButtonBuilder()
            .setCustomId('exit')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🚪')

        const row = new ActionRowBuilder().addComponents(prev, home, exit, next)
        let index = 0

        const msg = await interaction.editReply({
            embeds: [
                pages[index].setFooter({ text: `Página ${index + 1} / ${pages.length}` })
            ],
            components: [row],
            ephemeral: true,
            fetchReply: true
        })

        const filter = await msg.createMessageComponentCollector({
            ComponentType: ComponentType.Button,
            time: pagination_time
        })

        filter.on('collect', async i => {

            if (i?.user.id != interaction.user.id) return i?.reply({ 
                content: `❌ Solo quien uso el comando de queue puede navegar entre páginas`,
                ephemeral: true
            })

            await i.deferUpdate()

            switch (i.customId) {
                case 'prev':
                    filter.resetTimer()
                    index = index > 0 ? --index : pages.length - 1
                    await msg.edit({
                        embeds: [
                            pages[index].setFooter({ text: `Página ${index + 1} / ${pages.length}` })
                        ],
                        components: [row],
                        ephemeral: true
                    }).catch((e) => {console.error(e)})
                    break
                case 'next':
                    filter.resetTimer()
                    index = index + 1 < pages.length ? ++index : 0
                    await msg.edit({
                        embeds: [
                            pages[index].setFooter({ text: `Página ${index + 1} / ${pages.length}` })
                        ],
                        components: [row],
                        ephemeral: true
                    }).catch((e) => {console.error(e)})
                    break
                case 'home':
                    filter.resetTimer()
                    index = 0
                    await msg.edit({
                        embeds: [
                            pages[index].setFooter({ text: `Página ${index + 1} / ${pages.length}` })
                        ],
                        components: [row],
                        ephemeral: true
                    }).catch((e) => {console.error(e)})
                    break
                case 'exit':
                    filter.stop()
            }
        })

        filter.on('end', async () => {
            // Borrar mensajes después de 2
            interaction.deleteReply()
        })

        return msg

    } catch (error) {
        console.error(error)
    }
}