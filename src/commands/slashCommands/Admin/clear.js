const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const { COLOR, COLOR_ERROR } = require('@/config')
const { PEEPO_OK, PEEPO_SUSPICIOUS, PEEPO_SHOOTING } = require('@/images')
const BULK_DELETE_LIMIT = 100
const MAX_AMOUNT_MS = 14 * 24 * 60 * 60 * 1000 // 14 días en milisegundos

module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("limpiar")
        .setNameLocalizations({ "en-US": "clear" })
        .setDescription("Elimina los mensajes indicados del canal")
        .setDescriptionLocalizations({
            "en-US": "Deletes the indicated messages from the channel",
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addNumberOption(option =>
            option.setName("mensajes")
                .setNameLocalizations({ "en-US": "messages" })
                .setDescription("Número de mensajes a eliminar")
                .setDescriptionLocalizations({
                    "en-US": "Number of messages to delete",
                })
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(250)
        )
        .addStringOption(option =>
            option.setName("contiene")
                .setNameLocalizations({ "en-US": "contains" })
                .setDescription("Texto que deben contener los mensajes a eliminar")
                .setDescriptionLocalizations({
                    "en-US": "Text that the messages to delete must contain",
                })
        )
        .addBooleanOption(option =>
            option.setName("solo-bots")
                .setNameLocalizations({ "en-US": "bots" })
                .setDescription("Indica si solo se deben eliminar los mensajes de los bots")
                .setDescriptionLocalizations({
                    "en-US": "Indicates if only bot messages should be deleted",
                })
        )
        .addUserOption(option =>
            option.setName("objetivo")
                .setNameLocalizations({ "en-US": "target" })
                .setDescription("Indica a quien se desea eliminar los mensajes")
                .setDescriptionLocalizations({
                    "en-US": "Indicates who you want to delete the messages",
                })
        ),
    async execute(interaction) {

        let msgNum = interaction.options.getNumber("mensajes") ?? 10
        const user = interaction.options.getUser("objetivo")
        const contains = interaction.options.getString("contiene")?.toLowerCase()
        const botsOnly = interaction.options.getBoolean("solo-bots") ?? false

        let before
        const fetchedMessages = []

        while (msgNum > 0) {
            const limit = Math.min(msgNum, BULK_DELETE_LIMIT)
            const options = { limit }
            if (before) options.before = before

            const batch = await interaction.channel.messages.fetch(options)
            if (batch.size === 0) break

            fetchedMessages.push(...batch.values())
            before = batch.last().id
            msgNum -= batch.size
        }

        if (fetchedMessages.length === 0) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Number(COLOR_ERROR))
                        .setDescription("No hay mensajes para eliminar")
                        .setThumbnail(PEEPO_OK)
                ]
            })
        }

        const filteredMessages = fetchedMessages.filter((message) => {
            if (message.pinned) return false
            if (user && message.author.id !== user.id) return false
            if (botsOnly && !message.author.bot) return false
            if (contains && !message.content.toLowerCase().includes(contains)) return false
            if (Date.now() - message.createdTimestamp > MAX_AMOUNT_MS) return false
            return true
        })

        if (filteredMessages.length === 0) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Number(COLOR_ERROR))
                        .setDescription("No se encontraron mensajes que coincidan con los criterios de eliminación")
                        .setThumbnail(PEEPO_SUSPICIOUS)
                ]
            })
        }

        let deletedCount = 0

        for (let i = 0; i < filteredMessages.length; i += BULK_DELETE_LIMIT) {

            const chunk = filteredMessages.slice(i, i + BULK_DELETE_LIMIT)
            try {
                const result = await interaction.channel.bulkDelete(chunk, true)
                deletedCount += result.size
            } catch (error) {
            }
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('🧹 __Limpieza__ 🧹')
                    .setColor(
                        deletedCount > 0 ? COLOR : COLOR_ERROR
                    )
                    .setDescription(
                        `Se han eliminado \`${deletedCount}\` mensaje${deletedCount !== 1 ? 's' : ''} de ${user ? ('\`' + user.username + '\`') : botsOnly ? 'los bots' : 'los usuarios'}`
                    )
                    .setThumbnail(PEEPO_SHOOTING)
            ]
        })
        setTimeout(() => interaction.deleteReply(), 10000)
    }
}   