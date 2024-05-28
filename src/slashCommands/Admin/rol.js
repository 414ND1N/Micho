const { SlashCommandBuilder, PermissionFlagsBits , ChannelType } = require('discord.js')

module.exports = {
    cooldown: 5,
    CMD: new SlashCommandBuilder()
        .setName("rol")
        .setNameLocalizations({
            "en-US": "role"
        })
        .setDescription('Administra un rol.')
        .setDescriptionLocalizations({
            "en-US": 'Manage a role.'
        })
        // Agregar
        .addSubcommandGroup(group =>
            group.setName("agregar")
                .setNameLocalizations({
                    "en-US": "give"
                })
                .setDescription("Agregar un rol a un usuario.")
                .setDescriptionLocalizations({
                    "en-US": "Give a role to a user."
                })
                .addSubcommand(subcommand =>
                    subcommand.setName("objetivo")
                        .setNameLocalizations({
                            "en-US": "target"
                        })
                        .setDescription("Agregar un rol a un usuario.")
                        .setDescriptionLocalizations({
                            "en-US": "Give a role to a user."
                        })
                        .addUserOption(option =>
                            option.setName('usuario')
                                .setNameLocalizations({
                                    "en-US": "user"
                                })
                                .setDescription("Usuario á agregar rol.")
                                .setDescriptionLocalizations({
                                    "en-US": "User to add role."
                                })
                                .setRequired(true)
                        )
                        .addRoleOption(option =>
                            option.setName('rol')
                                .setNameLocalizations({
                                    "en-US": "role"
                                })
                                .setDescription("Rol á agregar al usuario.")
                                .setDescriptionLocalizations({
                                    "en-US": "Role to give to the user."
                                })
                                .setRequired(true)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand.setName("canal")
                        .setNameLocalizations({
                            "en-US": "channel"
                        })
                        .setDescription("Dar un rol a los usuarios en el canal de voz.")
                        .setDescriptionLocalizations({
                            "en-US": "Give a role to the users in the voice channel."
                        })
                        .addChannelOption(option =>
                            option.setName("channel")
                                .setNameLocalizations({
                                    "en-US": "channel"
                                })
                                .setDescription("Canal donde se encuentran los usuarios a los que se les dará el rol")
                                .setDescriptionLocalizations({
                                    "en-US": "Channel where the users to whom the role will be given are located."
                                })
                                .setRequired(true)
                                .addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildText)
                        )
                        .addRoleOption(option =>
                            option.setName('rol')
                                .setNameLocalizations({
                                    "en-US": "role"
                                })
                                .setDescription("Rol a dar a los usuarios.")
                                .setDescriptionLocalizations({
                                    "en-US": "Role to give to the users."
                                })
                                .setRequired(true)
                        )
                )
        )
        // Quitar
        .addSubcommandGroup(group =>
            group.setName("quitar")
                .setNameLocalizations({
                    "en-US": "remove"
                })
                .setDescription("Quitar un rol a un usuario.")
                .setDescriptionLocalizations({
                    "en-US": "Remove a role to a user."
                })

                .addSubcommand(subcommand =>
                    subcommand.setName("objetivo")
                        .setNameLocalizations({
                            "en-US": "target"
                        })
                        .setDescription("Quitar un rol a un usuario.")
                        .setDescriptionLocalizations({
                            "en-US": "Remove a role to a user."
                        })
                        .addUserOption(option =>
                            option.setName('usuario')
                                .setNameLocalizations({
                                    "en-US": "user"
                                })
                                .setDescription("Usuario a quitar rol.")
                                .setDescriptionLocalizations({
                                    "en-US": "User to remove role."
                                })
                                .setRequired(true)
                        )
                        .addRoleOption(option =>
                            option.setName('rol')
                                .setNameLocalizations({
                                    "en-US": "role"
                                })
                                .setDescription("Rol a quitar al usuario.")
                                .setDescriptionLocalizations({
                                    "en-US": "Role to remove to the user."
                                })
                                .setRequired(true)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand.setName("canal")
                        .setNameLocalizations({
                            "en-US": "channel"
                        })
                        .setDescription("Quitar un rol a los usuarios en el canal de voz.")
                        .setDescriptionLocalizations({
                            "en-US": "Remove a role to the users in the voice channel."
                        })
                        .addChannelOption(option =>
                            option.setName("channel")
                                .setNameLocalizations({
                                    "en-US": "channel"
                                })
                                .setDescription("Canal donde se encuentran los usuarios a los que se les quitará el rol.")
                                .setDescriptionLocalizations({
                                    "en-US": "Channel where the users to whom the role will be removed are located."
                                })
                                .setRequired(true)
                                .addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildText)
                        )
                        .addRoleOption(option =>
                            option.setName('rol')
                                .setNameLocalizations({
                                    "en-US": "role"
                                })
                                .setDescription("Rol a quitar a los usuarios.")
                                .setDescriptionLocalizations({
                                    "en-US": "Role to remove to the users."
                                })
                                .setRequired(true)
                        )
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,
    async execute(client, interaction) {
        // constantes
        const ROLE  = interaction.options.getRole('rol')
        //console.log(ROLE)
        if (!ROLE) return interaction.reply({
            content: `❌ **No se ha encontrado el rol**`,
            ephemeral: true
        })

        switch (interaction.options.getSubcommandGroup()) { // Grupo de subcomandos
            case "agregar":
                switch (interaction.options.getSubcommand()) { // Subcomandos
                    case "canal":

                        // Obtenemos el canal de voz a mutear
                        const _channel = interaction.options.getChannel("channel")

                        // Obtenemos los usuarios en el canal de voz
                        const _members = _channel.members

                        // Si no hay usuarios en el canal
                        if (_members.size === 0) return interaction.reply({
                            content: `❌ **No hay usuarios en el canal \`${_channel.name}\`**`,
                            ephemeral: true
                        })

                        // Accion
                        // Iteramos sobre los usuarios en el canal de voz
                        for (const member of _members) {
                            // Verificar si el usuario es un bot, si es un bot no se desilencia
                            guildMember = member[1]
                            if (!guildMember) continue
                            guildMember.roles.add(ROLE)
                        }

                        // Respuesta
                        return interaction.reply({
                            content: `**Se ha agregado el rol \`${ROLE.name}\` a los usuarios en el canal \`${_channel.name}\`**`,
                            ephemeral: true
                        })

                    case "objetivo":
                        // Accion
                        const USER = interaction.options.getUser('usuario')
                        try {
                            await interaction.guild.members.cache.get(USER.id).roles.add(ROLE)
                            // Respuesta
                            return interaction.reply({
                                content: `**Se ha agregado el rol \`${ROLE.name}\` al usuario \`${USER}\`**`,
                                ephemeral: true
                            })
                        } catch (error) {
                            console.log(error)
                            return interaction.reply({
                                content: `❌ **No se ha podido agregar el rol \`${ROLE.name}\` al usuario \`${USER}\`**`,
                                ephemeral: true
                            })
                        }
                }

                // Error
                return interaction.reply({
                    content: `❌ **No se ha encontrado la subcomando**`,
                    ephemeral: true
                })
            case "quitar":
                switch (interaction.options.getSubcommand()) { // Subcomandos
                    case "canal":

                        // Obtenemos el canal de voz a mutear
                        const _channel = interaction.options.getChannel("channel")

                        // Obtenemos los usuarios en el canal de voz
                        const _members = _channel.members

                        // Si no hay usuarios en el canal
                        if (_members.size === 0) return interaction.reply({
                            content: `❌ **No hay usuarios en el canal \`${_channel.name}\`**`,
                            ephemeral: true
                        })

                        // Accion
                        // Iteramos sobre los usuarios en el canal de voz
                        for (const member of _members) {
                            // Verificar si el usuario es un bot, si es un bot no se desilencia
                            guildMember = member[1]
                            if (!guildMember) continue  
                            guildMember.roles.add(ROLE)
                        }

                        // Respuesta
                        return interaction.reply({
                            content: `**Se ha quitado el rol \`${ROLE.name}\` a los usuarios en el canal \`${_channel.name}\`**`,
                            ephemeral: true
                        })

                    case "objetivo":
                        // Accion
                        const USER = interaction.options.getUser('usuario')
                        try {
                            await interaction.guild.members.cache.get(USER.id).roles.remove(ROLE)
                            // Respuesta
                            return interaction.reply({
                                content: `**Se ha quitado el rol \`${ROLE.name}\` al usuario \`${USER}\`**`,
                                ephemeral: true
                            })
                        } catch (error) {
                            console.log(error)
                            return interaction.reply({
                                content: `❌ **No se ha podido quitar el rol \`${ROLE.name}\` al usuario \`${USER}\`**`,
                                ephemeral: true
                            })
                        }
                }
                // Error
                return interaction.reply({
                    content: `❌ **No se ha encontrado la subcomando**`,
                    ephemeral: true
                })
        }
    }
}
