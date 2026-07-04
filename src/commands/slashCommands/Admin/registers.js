const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js')
const Channels = require('@/schemas/channels')
const Roles = require('@/schemas/roles')
const { ErrorEmbed } = require('@/utils/predifined_components')
const { COLOR } = require('@/config')

module.exports = {
    cooldown: 5,
    CMD: new SlashCommandBuilder()
        .setName("registros")
        .setNameLocalizations({
            "en-US": "registers"
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription('Gestiona registros de canales y roles en la base de datos.')
        .setDescriptionLocalizations({
            "en-US": 'Manage channel and role records in the database.'
        })
        // Subcomandos para CANALES
        .addSubcommand(subcommand =>
            subcommand
                .setName('agregar_canal')
                .setNameLocalizations({
                    'en-US': 'add_channel'
                })
                .setDescription('Agrega un registro de canal a la base de datos.')
                .setDescriptionLocalizations({
                    'en-US': 'Add a channel record to the database.'
                })
                .addChannelOption(option =>
                    option
                        .setName('canal')
                        .setNameLocalizations({
                            'en-US': 'channel'
                        })
                        .setDescription('Canal que se registrara en base de datos.')
                        .setDescriptionLocalizations({
                            'en-US': 'Channel to register in database.'
                        })
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('llave')
                        .setNameLocalizations({
                            'en-US': 'key'
                        })
                        .setDescription('Llave para identificar el canal en la base de datos.')
                        .setDescriptionLocalizations({
                            'en-US': 'Key to identify the channel in the database.'
                        })
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('actualizar_channel')
                .setNameLocalizations({
                    'en-US': 'update_channel'
                })
                .setDescription('Actualiza la llave de un canal registrado.')
                .setDescriptionLocalizations({
                    'en-US': 'Update the key of a registered channel.'
                })
                .addChannelOption(option =>
                    option
                        .setName('canal')
                        .setNameLocalizations({
                            'en-US': 'channel'
                        })
                        .setDescription('Canal a actualizar.')
                        .setDescriptionLocalizations({
                            'en-US': 'Channel to update.'
                        })
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('nueva_llave')
                        .setNameLocalizations({
                            'en-US': 'new_key'
                        })
                        .setDescription('Nueva llave para el canal.')
                        .setDescriptionLocalizations({
                            'en-US': 'New key for the channel.'
                        })
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('listar_canales')
                .setNameLocalizations({
                    'en-US': 'list_channels'
                })
                .setDescription('Muestra todos los canales registrados del servidor.')
                .setDescriptionLocalizations({
                    'en-US': 'Show all registered channels of the server.'
                })
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('eliminar_canal')
                .setNameLocalizations({
                    'en-US': 'delete_channel'
                })
                .setDescription('Elimina el registro de un canal de la base de datos.')
                .setDescriptionLocalizations({
                    'en-US': 'Delete a channel record from the database.'
                })
                .addChannelOption(option =>
                    option
                        .setName('canal')
                        .setNameLocalizations({
                            'en-US': 'channel'
                        })
                        .setDescription('Canal a eliminar.')
                        .setDescriptionLocalizations({
                            'en-US': 'Channel to delete.'
                        })
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('llave')
                        .setNameLocalizations({
                            'en-US': 'key'
                        })
                        .setDescription('Llave del registro a eliminar.')
                        .setDescriptionLocalizations({
                            'en-US': 'Key of the record to delete.'
                        })
                        .setRequired(true)
                )
        )
        // Subcomandos para ROLES
        .addSubcommand(subcommand =>
            subcommand
                .setName('agregar_rol')
                .setNameLocalizations({
                    'en-US': 'add_role'
                })
                .setDescription('Agrega un registro de rol a la base de datos.')
                .setDescriptionLocalizations({
                    'en-US': 'Add a role record to the database.'
                })
                .addRoleOption(option =>
                    option
                        .setName('rol')
                        .setNameLocalizations({
                            'en-US': 'role'
                        })
                        .setDescription('Rol que se registrara en base de datos.')
                        .setDescriptionLocalizations({
                            'en-US': 'Role to register in database.'
                        })
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('llave')
                        .setNameLocalizations({
                            'en-US': 'key'
                        })
                        .setDescription('Llave para identificar el rol en la base de datos.')
                        .setDescriptionLocalizations({
                            'en-US': 'Key to identify the role in the database.'
                        })
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('actualizar_rol')
                .setNameLocalizations({
                    'en-US': 'update_role'
                })
                .setDescription('Actualiza la llave de un rol registrado.')
                .setDescriptionLocalizations({
                    'en-US': 'Update the key of a registered role.'
                })
                .addRoleOption(option =>
                    option
                        .setName('rol')
                        .setNameLocalizations({
                            'en-US': 'role'
                        })
                        .setDescription('Rol a actualizar.')
                        .setDescriptionLocalizations({
                            'en-US': 'Role to update.'
                        })
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('nueva_llave')
                        .setNameLocalizations({
                            'en-US': 'new_key'
                        })
                        .setDescription('Nueva llave para el rol.')
                        .setDescriptionLocalizations({
                            'en-US': 'New key for the role.'
                        })
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('listar_roles')
                .setNameLocalizations({
                    'en-US': 'list_roles'
                })
                .setDescription('Muestra todos los roles registrados del servidor.')
                .setDescriptionLocalizations({
                    'en-US': 'Show all registered roles of the server.'
                })
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('eliminar_rol')
                .setNameLocalizations({
                    'en-US': 'delete_role'
                })
                .setDescription('Elimina el registro de un rol de la base de datos.')
                .setDescriptionLocalizations({
                    'en-US': 'Delete a role record from the database.'
                })
                .addRoleOption(option =>
                    option
                        .setName('rol')
                        .setNameLocalizations({
                            'en-US': 'role'
                        })
                        .setDescription('Rol a eliminar.')
                        .setDescriptionLocalizations({
                            'en-US': 'Role to delete.'
                        })
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('llave')
                        .setNameLocalizations({
                            'en-US': 'key'
                        })
                        .setDescription('Llave del registro a eliminar.')
                        .setDescriptionLocalizations({
                            'en-US': 'Key of the record to delete.'
                        })
                        .setRequired(true)
                )
        )
    ,
    /**
    * @param {ChatInputCommandInteraction} interaction
    */
    async execute(interaction) {
        if (!interaction.guild) {
            return interaction.reply({
                content: '❌ Este comando solo se puede usar dentro de un servidor.',
                ephemeral: true
            })
        }

        const guildID = interaction.guild.id
        const subcommand = interaction.options.getSubcommand()

        try {
            switch (subcommand) {
                // AGREGAR CANAL
                case 'agregar_canal': {
                    const channel = interaction.options.getChannel('canal')
                    const key = interaction.options.getString('llave')

                    const channelExists = await Channels.findOne({
                        guild_id: guildID,
                        key: key
                    })

                    if (channelExists) {
                        return interaction.reply({
                            content: `❌ El canal con llave \`${key}\` ya está registrado en la base de datos.`,
                            ephemeral: true
                        })
                    }

                    await Channels.create({
                        channel_id: channel.id,
                        guild_id: guildID,
                        key: key
                    })

                    return interaction.reply({
                        content: `✅ Canal \`${channel.name}\` registrado en base de datos con llave \`${key}\`.`,
                        ephemeral: true
                    })
                }

                // ACTUALIZAR CANAL
                case 'actualizar_canal': {
                    const channel = interaction.options.getChannel('canal')
                    const newKey = interaction.options.getString('nueva_llave')

                    const channelExists = await Channels.findOne({
                        guild_id: guildID,
                        channel_id: channel.id
                    })

                    if (!channelExists) {
                        return interaction.reply({
                            content: `❌ El canal \`${channel.name}\` no está registrado en la base de datos.`,
                            ephemeral: true
                        })
                    }

                    const newKeyExists = await Channels.findOne({
                        guild_id: guildID,
                        key: newKey
                    })

                    if (newKeyExists && newKeyExists.channel_id !== channel.id) {
                        return interaction.reply({
                            content: `❌ La llave \`${newKey}\` ya está en uso por otro canal.`,
                            ephemeral: true
                        })
                    }

                    await Channels.findOneAndUpdate(
                        { guild_id: guildID, channel_id: channel.id },
                        { key: newKey }
                    )

                    return interaction.reply({
                        content: `✅ Canal \`${channel.name}\` actualizado con nueva llave \`${newKey}\`.`,
                        ephemeral: true
                    })
                }

                // LISTAR CANALES
                case 'listar_canales': {
                    const allChannels = await Channels.findAll()
                    const guildChannels = allChannels.filter(ch => ch.guild_id === guildID)

                    if (guildChannels.length === 0) {
                        return interaction.reply({
                            content: '❌ No hay canales registrados en este servidor.',
                            ephemeral: true
                        })
                    }

                    const fields = guildChannels.map((ch, index) => {
                        const channelObj = interaction.guild.channels.cache.get(ch.channel_id)
                        const channelName = channelObj ? channelObj.name : 'Canal eliminado'
                        return {
                            name: `${index + 1}. Llave: \`${ch.key}\``,
                            value: `Canal: #${channelName} (\`${ch.channel_id}\`)`
                        }
                    })

                    const listEmbed = new EmbedBuilder()
                        .setColor(COLOR)
                        .setTitle('📋 Canales Registrados del Servidor')
                        .setDescription('Lista de canales registrados en la base de datos del servidor.')
                        .setTimestamp()
                        .addFields(fields)

                    return interaction.reply({
                        embeds: [listEmbed],
                        ephemeral: true
                    })
                }

                // ELIMINAR CANAL
                case 'eliminar_canal': {
                    const channel = interaction.options.getChannel('canal')
                    const key = interaction.options.getString('llave')

                    const channelExists = await Channels.findOne({
                        guild_id: guildID,
                        channel_id: channel.id,
                        key: key
                    })

                    if (!channelExists) {
                        return interaction.reply({
                            content: `❌ El canal \`${channel.name}\` con llave \`${key}\` no está registrado en la base de datos.`,
                            ephemeral: true
                        })
                    }

                    await Channels.delete({
                        guild_id: guildID,
                        channel_id: channel.id,
                        key: key
                    })

                    return interaction.reply({
                        content: `✅ Canal \`${channel.name}\` con llave \`${key}\` eliminado de la base de datos.`,
                        ephemeral: true
                    })
                }

                // AGREGAR ROL
                case 'agregar_rol': {
                    const role = interaction.options.getRole('rol')
                    const key = interaction.options.getString('llave')

                    const roleExists = await Roles.findOne({
                        guild_id: guildID,
                        key: key
                    })

                    if (roleExists) {
                        return interaction.reply({
                            content: `❌ El rol con llave \`${key}\` ya está registrado en la base de datos.`,
                            ephemeral: true
                        })
                    }

                    await Roles.create({
                        guild_id: guildID,
                        rol_id: role.id,
                        key: key
                    })

                    return interaction.reply({
                        content: `✅ Rol \`${role.name}\` registrado en base de datos con llave \`${key}\`.`,
                        ephemeral: true
                    })
                }

                // ACTUALIZAR ROL
                case 'actualizar_rol': {
                    const role = interaction.options.getRole('rol')
                    const newKey = interaction.options.getString('nueva_llave')

                    const roleExists = await Roles.findOne({
                        guild_id: guildID,
                        rol_id: role.id
                    })

                    if (!roleExists) {
                        return interaction.reply({
                            content: `❌ El rol \`${role.name}\` no está registrado en la base de datos.`,
                            ephemeral: true
                        })
                    }

                    const newKeyExists = await Roles.findOne({
                        guild_id: guildID,
                        key: newKey
                    })

                    if (newKeyExists && newKeyExists.rol_id !== role.id) {
                        return interaction.reply({
                            content: `❌ La llave \`${newKey}\` ya está en uso por otro rol.`,
                            ephemeral: true
                        })
                    }

                    await Roles.findOneAndUpdate(
                        { guild_id: guildID, rol_id: role.id },
                        { key: newKey }
                    )

                    return interaction.reply({
                        content: `✅ Rol \`${role.name}\` actualizado con nueva llave \`${newKey}\`.`,
                        ephemeral: true
                    })
                }

                // LISTAR ROLES
                case 'listar_roles': {
                    const allRoles = await Roles.findAll()
                    const guildRoles = allRoles.filter(r => r.guild_id === guildID)

                    if (guildRoles.length === 0) {
                        return interaction.reply({
                            content: '❌ No hay roles registrados en este servidor.',
                            ephemeral: true
                        })
                    }

                    const fields = guildRoles.map((rl, index) => {
                        const roleObj = interaction.guild.roles.cache.get(rl.rol_id)
                        const roleName = roleObj ? roleObj.name : 'Rol eliminado'
                        return {
                            name: `${index + 1}. Llave: \`${rl.key}\``,
                            value: `Rol: @${roleName} (\`${rl.rol_id}\`)`
                        }
                    })

                    const listEmbed = new EmbedBuilder()
                        .setColor(COLOR)
                        .setTitle('📋 Roles Registrados del Servidor')
                        .setDescription('Lista de roles registrados en la base de datos del servidor.')
                        .setTimestamp()
                        .addFields(fields)

                    return interaction.reply({
                        embeds: [listEmbed],
                        ephemeral: true
                    })
                }

                // ELIMINAR ROL
                case 'eliminar_rol': {
                    const role = interaction.options.getRole('rol')
                    const key = interaction.options.getString('llave')

                    const roleExists = await Roles.findOne({
                        guild_id: guildID,
                        rol_id: role.id,
                        key: key
                    })

                    if (!roleExists) {
                        return interaction.reply({
                            content: `❌ El rol \`${role.name}\` con llave \`${key}\` no está registrado en la base de datos.`,
                            ephemeral: true
                        })
                    }

                    await Roles.delete({
                        guild_id: guildID,
                        rol_id: role.id,
                        key: key
                    })

                    return interaction.reply({
                        content: `✅ Rol \`${role.name}\` con llave \`${key}\` eliminado de la base de datos.`,
                        ephemeral: true
                    })
                }

                default:
                    return interaction.reply({
                        embeds: [ErrorEmbed('Subcomando no reconocido. Por favor, verifica la sintaxis del comando.')],
                    })
            }
        } catch (error) {
            console.error(error)
            return interaction.reply({
                embeds: [ErrorEmbed('Ocurrió un error al procesar el comando. Por favor, inténtalo de nuevo más tarde.')],
            })
        }
    }
}

