module.exports = async (client, interaction) => {
    if (!interaction.guild || !interaction.channel) return;

    const COMANDO = client.slashCommands.get(interaction?.commandName);

    if (COMANDO) {
        if (COMANDO.OWNER) {
            const DUENOS = process.env.OWNER_IDS.split(" ");
            if (!DUENOS.include(interaction.user.id)) return interaction.reply({ content: `❌ **Solo los dueños del bot pueden ejecutar este comando! 🤨**\nFirma ${DUENOS.map(DUENO => `<@${DUENO}>`).join(", ")}` })

        }

        if (COMANDO.BOT_PERMISSIONS) {
            if (!interaction.guild.members.me.permissions.has(COMANDO.BOT_PERMISSIONS)) return interaction.reply({ content: `❌ **Necesito los siguientes permisos para ejecutar este comando 💀 :**\n${COMANDO.BOT_PERMISSIONS.map(PERMISO => `\`${PERMISO}\``).join(", ")}` })

        }

        if (COMANDO.PERMISSIONS) {
            if (!interaction.members.permissions.has(COMANDO.PERMISSIONS)) return interaction.reply({ content: `❌ **Necesitas los siguientes permisos para ejecutar este comando  :**\n${COMANDO.PERMISSIONS.map(PERMISO => `\`${PERMISO}\``).join(", ")}` })

        }

        try {
            COMANDO.execute(client, interaction, "/");
        } catch (e) {
            interaction.reply({ content: `**Ha ocurrido un error al ejecutar el comando!**\n*Mira la consola para mas detalle 💀*` });
            console.log(e)
            return;
        }
        /*
        // Context Menu Handling
        if (interaction.isContextMenu()) {
            await interaction.deferReply({ ephemeral: false });
            const command = client.slashCommands.get(interaction.commandName);
            if (command) command.run(client, interaction);
        }
        */
    }

}