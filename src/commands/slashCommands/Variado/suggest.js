const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')
const Channels = require('@/schemas/channels')
const { COLOR, COLOR_ERROR } = require('@/config')
const { PEEPO_COUNCIL, PEEPO_OK, PEEPO_DOUBT } = require('@/images')
const { ErrorEmbed } = require('@/utils/predifined_components')

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

                // Buscar el rol en la bd con el guildID y el nombre
                const CHANNEL_DATA = await Channels.findOne({ guild_id: interaction.guild.id, key: "suggest" })
                if (!CHANNEL_DATA) {
                    return interaction.reply({
                        content: `❌ **No se ha encontrado el canal de sugerencias en la base de datos**`,
                        ephemeral: true
                    })
                }

                const sugerencia = modalInteraction.fields.getTextInputValue('suggestInput')
                const channel = client.channels.cache.get(CHANNEL_DATA.channel_id) //ID del canal de sugerencias
                const AUTHOR = interaction.member?.nickname ?? interaction.user.username // Si no tiene apodo, se usa el nombre de usuario

                const mensaje = await channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`Sugerencia de \`${AUTHOR}\``)
                            .setDescription(`\`${sugerencia}\``)
                            .setColor(COLOR)
                            .setTimestamp()
                            .setThumbnail(PEEPO_COUNCIL)
                    ], fetchReply: true
                })
                mensaje.react(`👍`)
                mensaje.react(`👎`)

                return modalInteraction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`Sugerencia realizada`)
                            .setDescription(`Sugerencia \`${sugerencia}\` enviada a ${channel}`)
                            .setColor(COLOR)
                            .setTimestamp()
                            .setThumbnail(PEEPO_OK)
                    ], ephemeral: true
                })
            })
            .catch(async (_) => {
                interaction.followUp({
                    embeds: [ErrorEmbed('No se ha recibido respuesta a tiempo')],
                    ephemeral: true
                })
            })
    }
} 