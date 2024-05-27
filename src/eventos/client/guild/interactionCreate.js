const { Collection } = require('discord.js');

module.exports = async (client, interaction) => {
    if (!interaction.guild || !interaction.channel) return; // Si no contiene guild o channel, no hacer nada

    if (interaction.isChatInputCommand()) { // Si no es un comando, no hacer nada

        // ** Manejo de comandos
        const COMANDO = client.slashCommands.get(interaction?.commandName);

        if (COMANDO) {
            if (COMANDO.OWNER) {
                const DUENOS = process.env.OWNER_IDS.split(" ");
                if (!DUENOS.include(interaction.user.id)) return interaction.reply({
                    content: `❌ **Solo los dueños del bot pueden ejecutar este comando! 🤨**`
                })
            }

            if (COMANDO.BOT_PERMISSIONS) {
                if (!interaction.guild.members.me.permissions.has(COMANDO.BOT_PERMISSIONS)) return interaction.reply({
                    content: `❌ **Necesito los siguientes permisos para ejecutar este comando 💀 :**\n${COMANDO.BOT_PERMISSIONS.map(PERMISO => `\`${PERMISO}\``).join(", ")}`
                })
            }

            if (COMANDO.PERMISSIONS) {
                if (!interaction.members.permissions.has(COMANDO.PERMISSIONS)) return interaction.reply({
                    content: `❌ **Necesitas los siguientes permisos para ejecutar este comando  :**\n${COMANDO.PERMISSIONS.map(PERMISO => `\`${PERMISO}\``).join(", ")}`
                })
            }

            // ++ Manejo de coldowns
            const { cooldowns } = interaction.client

            if (!cooldowns.has(interaction?.commandName)) {
                cooldowns.set(interaction?.commandName, new Collection())
            }

            const now = Date.now()
            const timestamps = cooldowns.get(COMANDO.CMD.name)
            const defaultCooldownDuration = 5
            const cooldownAmount = (COMANDO.cooldown ?? defaultCooldownDuration) * 1_000


            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount
                if (now < expirationTime) {
                    const expiredTimestamp = Math.round(expirationTime / 1000)
                    const reply = interaction.reply({
                        content: `Puedes usar el comando ${COMANDO.CMD.name} dentro de <t:${expiredTimestamp}:R>.`,
                        ephemeral: true
                    })
                    // ++ Elimina el mensaje de advertencia de cooldown después de que expire el tiempo de cooldown
                    setTimeout(() => {
                        interaction.deleteReply(reply)
                    }, expirationTime - now)

                    return
                }
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

            try {
                COMANDO.execute(client, interaction, "/");
            } catch (e) {
                interaction.reply({ content: `**Ha ocurrido un error al ejecutar el comando!**\n*Mira la consola para mas detalle 💀*` });
                console.log(e)
                return;
            }
        }
    } else if (interaction.isButton()) {
        switch (interaction.customId) {
            case 'verify_role': { // Verificar usuario para darle el rol de verificado
                const role = interaction.guild.roles.cache.get(process.env.ID_ROL_VERIFICADO);
                if (!role) return interaction.reply({ content: `❌ **No se ha encontrado el rol de verificado**` });

                interaction.member.roles.add(role)
                    .then(() => {
                        interaction.reply({
                            content: `✅ **Te has verificado correctamente!**`,
                            ephemeral: true
                        });
                    })
                    .catch(() => {
                        interaction.reply({
                            content: `❌ **No se ha podido verificar**`,
                            ephemeral: true
                        });
                    })
                break;
            }
        }
        // respond to the button
    }
    // else if (interaction.isStringSelectMenu()) {
    //     // respond to the select menu
    // }

    /*
        // Context Menu Handling
        if (interaction.isContextMenu()) {
            await interaction.deferReply({ ephemeral: false });
            const command = client.slashCommands.get(interaction.commandName);
            if (command) command.run(client, interaction);
        }
        */

}