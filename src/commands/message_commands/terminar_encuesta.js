const { ContextMenuCommandBuilder, ApplicationCommandType , PermissionFlagsBits} = require('discord.js');

module.exports = {
    CMD: new ContextMenuCommandBuilder()
        .setName("terminarencuesta")
        .setNameLocalizations({
            "en-US": "endpoll"
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.SendPolls)
        .setType(ApplicationCommandType.Message),

    async execute(client, interaction) {
        const MESSAGE = interaction.targetMessage

        if (!MESSAGE.poll) {
            return interaction.reply({
                content: 'El mensaje no es una encuesta.', 
                ephemeral: true 
            })
        }

        // Verificar si el mensaje fue creado por el bot
        if (MESSAGE.author.id !== client.user.id) {
            return interaction.reply({
                content: 'El bot no puede finalizar encuestas que no fueron creadas por él.',
                ephemeral: true
            })
        }

        // Finalizar encuesta
        MESSAGE.poll.end()

        // Mensaje de confirmación
        return interaction.reply({
            content: `Encuesta finalizada.`,
            ephemeral: true
        })
    }
} 