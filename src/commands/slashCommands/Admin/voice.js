const {SlashCommandBuilder,PermissionFlagsBits, ChannelType} = require('discord.js')

module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("voz")
        .setNameLocalizations({
            "en-US": "voice"
        })
        .setDescription('Controla la voz en un canal de voz.')
        .setDescriptionLocalizations({
            "en-US": 'Manage voice in a voice channel.'
        })
        // Agregar
        .addSubcommandGroup(group =>
            group.setName("activar")
                .setNameLocalizations({
                    "en-US": "enable"
                })
                .setDescription("Activar la voz en un canal de voz.")
                .setDescriptionLocalizations({
                    "en-US": "Enable voice in a voice channel."
                })
            .addSubcommand(subcommand =>
                subcommand.setName("objetivo")
                    .setNameLocalizations({
                        "en-US": "target"
                    })
                    .setDescription("Activar voz a un usuario.")
                    .setDescriptionLocalizations({
                        "en-US": "Enable voice to a user."
                    })
                    .addUserOption(option =>
                        option.setName('usuario')
                            .setNameLocalizations({
                                "en-US": "user"
                            })
                            .setDescription("Usuario a activar voz.")
                            .setDescriptionLocalizations({
                                "en-US": "User to enable voice."
                            })
                            .setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand.setName("canal")
                    .setNameLocalizations({
                        "en-US": "channel"
                    })
                    .setDescription("Activar la voz en un canal de voz.")
                    .setDescriptionLocalizations({
                        "en-US": "Enable voice in a voice channel."
                    })
                    .addChannelOption(option =>
                        option.setName("channel")
                            .setNameLocalizations({
                                "en-US": "channel"
                            })
                            .setDescription("Canal de voz a activar.")
                            .setDescriptionLocalizations({
                                "en-US": "Voice channel to enable."
                            })
                            .setRequired(true)
                            .addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildStageVoice)
                    )
            )
        )
        // Quitar
        .addSubcommandGroup(group =>
            group.setName("desactivar")
                .setNameLocalizations({
                    "en-US": "disable"
                })
                .setDescription("Desactivar la voz en un canal de voz.")
                .setDescriptionLocalizations({
                    "en-US": "Disable voice in a voice channel."
                })
            .addSubcommand(subcommand =>
                subcommand.setName("objetivo")
                    .setNameLocalizations({
                        "en-US": "target"
                    })
                    .setDescription("Silenciar a un usuario.")
                    .setDescriptionLocalizations({
                        "en-US": "Mute a user."
                    })
                    .addUserOption(option =>
                        option.setName('usuario')
                            .setNameLocalizations({
                                "en-US": "user"
                            })
                            .setDescription("Usuario a silenciar.")
                            .setDescriptionLocalizations({
                                "en-US": "User to mute."
                            })
                            .setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand.setName("canal")
                    .setNameLocalizations({
                        "en-US": "channel"
                    })
                    .setDescription("Silenciar un canal de voz.")
                    .setDescriptionLocalizations({
                        "en-US": "Mute a voice channel."
                    })
                    .addChannelOption(option =>
                        option.setName("channel")
                            .setNameLocalizations({
                                "en-US": "channel"
                            })
                            .setDescription("Canal de voz a silenciar.")
                            .setDescriptionLocalizations({
                                "en-US": "Channel to mute."
                            })
                            .setRequired(true)
                            .addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildStageVoice)
                    )
            )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,
    async execute(client, interaction){
        
        // Verificar si se debe activar o desactivar la voz
        // 0 = Activar, 1 = Desactivar
        const _voiceState = interaction.options.getSubcommandGroup() === "activar" ? 0 : 1

        switch (interaction.options.getSubcommand()) {
            case "objetivo":
                // Accion
                const USER = interaction.options.getUser('usuario')
                try {

                    await interaction.guild.members.cache.get(USER.id).voice.setMute(_voiceState).catch(err =>{})
                    // Respuesta
                    if (_voiceState === 0) {
                        return interaction.reply({
                            content: `**Todos los usuarios en el canal \`${_channel.name}\` han sido activados**`,
                            ephemeral: true
                        })
                    }
                    return interaction.reply({
                        content: `**El usuario \`${USER}\` ha sido silenciado**`,
                        ephemeral: true
                    })
                } catch (error) {
                    console.log(error)
                    // Respuesta
                    return interaction.reply({
                        content: `**No se pudo silenciar al usuario \`${USER}\`**`,
                        ephemeral: true
                    })
                }
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
                try {
                    // Iteramos sobre los usuarios en el canal de voz
                    for (const member of _members) {
                        // Verificar si el usuario es un bot, si es un bot no se desilencia
                        guildMember = member[1]
                        if (!guildMember) continue
                        guildMember.voice.setMute(_voiceState).catch(err =>{})
                    }
                    
                    if (_voiceState === 0) {
                        return interaction.reply({
                            content: `**Todos los usuarios en el canal \`${_channel.name}\` han sido activados**`,
                            ephemeral: true
                        })
                    }

                    // Respuesta
                    return interaction.reply({
                        content: `**Todos losusuarios en el canal \`${_channel.name}\` han sido silenciados**`,
                        ephemeral: true
                    })
                    
                } catch (error) {
                    console.log(error)
                    // Respuesta
                    return interaction.reply({
                        content: `**No se pudo silenciar a los usuarios en el canal \`${_channel.name}\`**`,
                        ephemeral: true
                    })
                }
        }
    }
} 

