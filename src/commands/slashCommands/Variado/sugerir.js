const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')

module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("sugerir")
        .setNameLocalizations({
            "en-US": "suggest"
        })
        .setDescription("Dar sugerencia a votación en el canal de sugerencias")
        .setDescriptionLocalizations({
            "en-US": "Give suggestion to vote in the suggestions channel"
        })
    ,
    async execute(interaction) {
        const { client } = interaction
        // Modal para confirmar la sugerencia
        const modal = new ModalBuilder()
            .setTitle('Sugerir | Suggest')
            .setCustomId(`suggestModal-${interaction.user.id}`)

        const input = new TextInputBuilder()
            .setCustomId('suggestInput')
            .setLabel('Sugerencia|Suggestion')
            .setMaxLength(200)
            .setMinLength(5)
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph)

        const firstActionRow = new ActionRowBuilder().addComponents(input)

        modal.addComponents(firstActionRow)
        await interaction.showModal(modal)

        // Esperar respuesta
        const filter = (interaction) => interaction.customId === `suggestModal-${interaction.user.id}`

        interaction
            .awaitModalSubmit({ filter, time: 50_000 })
            .then(async (modalInteraction) => {
                const sugerencia = modalInteraction.fields.getTextInputValue('suggestInput')
                const channel = client.channels.cache.get(process.env.ID_CANAL_SUGERENCIAS) //ID del canal de sugerencias
                const AUTHOR = interaction.member?.nickname ?? interaction.user.username // Si no tiene apodo, se usa el nombre de usuario

                const mensaje = await channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`Sugerencia de \`${AUTHOR}\``)
                            .setDescription(`\`${sugerencia}\``)
                            .setColor(process.env.COLOR)
                            .setTimestamp()
                            .setThumbnail(`https://i.imgur.com/t6AR3RO.gif`)
                    ], fetchReply: true
                })
                mensaje.react(`👍`)
                mensaje.react(`👎`)

                return modalInteraction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`Sugerencia realizada`)
                            .setDescription(`Sugerencia \`${sugerencia}\` enviada a ${channel}`)
                            .setColor(process.env.COLOR)
                            .setTimestamp()
                            .setThumbnail(`https://i.imgur.com/X3E6BAy.gif`)
                    ], ephemeral: true
                })
            })
            .catch(async (_) => {
                interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('No se ha recibido respuesta')
                            .setColor(process.env.COLOR_ERROR)
                            .setDescription('No se ha recibido respuesta\nInténtalo de nuevo.')
                            .setThumbnail('https://i.imgur.com/rIPXKFQ.png')
                            .setTimestamp()
                    ],
                    ephemeral: true
                })
            })
    }
} 