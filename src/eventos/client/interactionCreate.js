const { Collection } = require('discord.js')
const { Events } = require('discord.js')
const Roles = require('../../schemas/Roles')

// Buttons functions

async function verify_role(interaction) {
    // Buscar el rol en la bd con el guildID y el nombre
    const ROL_DATA = await Roles.findOne({ GuildID: interaction.guild.id, Name: "Verificado" })
    if (!ROL_DATA) {
        return interaction.reply({
            content: `❌ **No se ha encontrado el rol de Verficado en la base de datos**`,
            ephemeral: true
        })
    }

    // Buscar el rol en el servidor
    const ROL_VERIFICADO = interaction.guild.roles.cache.get(ROL_DATA.RolID)

    if (!ROL_VERIFICADO) {
        return interaction.reply({
            content: `❌ **No se ha encontrado el rol de verificado**`,
            ephemeral: true
        })
    }

    // Agregar el rol al usuario
    interaction.member.roles.add(ROL_VERIFICADO)
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
}


module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.guild || !interaction.channel) return; // Si no contiene guild o channel, no hacer nada

        // ++ Tipos de interaction ++
        // isButton() - Si es un botón
        // isChatInputCommand() - Si es un comando de chat
        // isContextMenuCommand() - Si es un comando de menú contextual
        // isMessageContextMenuCommand() - Si es un comando de menú contextual de mensaje
        // isSelectMenu() - Si es un menú de selección
        // isUserContextMenuCommand() - Si es un comando de menú contextual de usuario

        // ** Manejo de comandos
        if (interaction.isChatInputCommand() || interaction.isUserContextMenuCommand() || interaction.isMessageContextMenuCommand()) {

            // Busca el comando en la colección de comandos slash, app y message
            const COMANDO = interaction.client.commands.get(interaction?.commandName)

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
                const cooldownAmount = (COMANDO.cooldown ?? 5) * 1_000 // 5 segundos por defecto

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

                timestamps.set(interaction.user.id, now)
                setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount)

                try {
                    COMANDO.execute(interaction, "/")
                } catch (e) {
                    interaction.reply({
                        content: `**Ha ocurrido un error al ejecutar el comando!**\n*Mira la consola para mas detalle 💀*`
                    })
                    console.log(e)
                    return
                }
            }
        } else if (interaction.isButton()) {
            switch (interaction.customId) {
                case 'verify_role': { // Verificar usuario para darle el rol de verificado
                    verify_role(interaction)
                    break;
                }
            }
        }
    }
}
