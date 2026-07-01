const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');
const Channels = require('@/schemas/channels');
const Roles = require('@/schemas/roles');

module.exports = {
    cooldown: 5,
    CMD: new SlashCommandBuilder()
        .setName("basededatos")
        .setNameLocalizations({
            "en-US": "database"
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription('Gestiona registros de canales y roles en la base de datos.')
        .setDescriptionLocalizations({
            "en-US": 'Manage channel and role records in the database.'
        })
        .addSubcommand(subcommand =>
            subcommand
                .setName('channels')
                .setNameLocalizations({
                    'en-US': 'channels'
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
                .setName('roles')
                .setNameLocalizations({
                    'en-US': 'roles'
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
    ,
    /**
    * @param {ChatInputCommandInteraction} interaction
    */
    async execute(interaction) {
        if (!interaction.guild) {
            return interaction.reply({
                content: '❌ Este comando solo se puede usar dentro de un servidor.',
                ephemeral: true
            });
        }

        const guildID = interaction.guild.id;
        const subcommand = interaction.options.getSubcommand();
        const key = interaction.options.getString('llave');

        try {
            switch (subcommand) {
                case 'channels': {
                    const channel = interaction.options.getChannel('canal');

                    const channelExists = await Channels.findOne({
                        guild_id: guildID,
                        key: key
                    });

                    if (channelExists) {
                        return interaction.reply({
                            content: `❌ El canal \`${channel.name}\` ya esta registrado en la base de datos.`,
                            ephemeral: true
                        });
                    }

                    await Channels.create({
                        channel_id: channel.id,
                        guild_id: guildID,
                        key: key
                    });

                    return interaction.reply({
                        content: `✅ Canal \`${channel.name}\` registrado en base de datos.`,
                        ephemeral: true
                    });
                }

                case 'roles': {
                    const role = interaction.options.getRole('rol');

                    const roleExists = await Roles.findOne({
                        guild_id: guildID,
                        rol_id: role.id,
                        key: key
                    });

                    if (roleExists) {
                        return interaction.reply({
                            content: `❌ El rol \`${role.name}\` ya esta registrado en la base de datos.`,
                            ephemeral: true
                        });
                    }

                    await Roles.create({
                        guild_id: guildID,
                        rol_id: role.id,
                        key: key
                    });

                    return interaction.reply({
                        content: `✅ Rol \`${role.name}\` registrado en base de datos.`,
                        ephemeral: true
                    });
                }

                default:
                    return interaction.reply({
                        content: '❌ Subcomando no reconocido.',
                        ephemeral: true
                    });
            }
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: '❌ Ocurrio un error al registrar los datos en la base de datos.',
                ephemeral: true
            });
        }
    }
}

