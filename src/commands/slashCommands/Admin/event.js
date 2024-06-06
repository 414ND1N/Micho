// ?¿  Este comando es solo para emitir eventos como prueba
const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js')
module.exports = {
    cooldown: 10,
    CMD: new SlashCommandBuilder()
        .setName("evento")
        .setNameLocalizations({
            "en-US": "event"
        })
        .setDescription('Maneja eventos del servidor.')
        .setDescriptionLocalizations({
            "en-US": 'Manage server events.'
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand.setName("emitir")
                .setNameLocalizations({
                    "en-US": "emit"
                })
                .setDescription("Emite un evento.")
                .setDescriptionLocalizations({
                    "en-US": "Emit an event."
                })
                .addStringOption(option =>
                    option
                        .setName("evento")
                        .setNameLocalizations({
                            "en-US": "event"
                        })
                        .setDescription("Nombre del evento.")
                        .setDescriptionLocalizations({
                            "en-US": "Event name."
                        })
                        .setRequired(true)
                        .addChoices(
                            { name: 'GuildMemberAdd ', value: 'guildMemberAdd' },
                            //{ name: 'GuildMemberUpdate', value: 'guildMemberUpdate' },
                            //{ name: 'GuildStickerCreate', value: 'stickerCreate' },
                            //{ name: 'PresenceUpdate', value: 'presenceUpdate' },
                        )
                )

        )
    ,
    async execute(client, interaction) {

        const { member, options } = interaction
        const EVENT = options.getString("evento")

        try {
            switch (EVENT) {
                case 'guildMemberAdd':
                    // client, member
                    client.emit('guildMemberAdd', member)
                    break
    
                // case 'guildMemberUpdate':
                //     // oldMember, newMember
                //     client.emit('guildMemberUpdate', member, member)
                //     break
    
                default:
                    // !! No existe el evento
                    return interaction.reply({
                        content: `El evento ${EVENT} no existe.`,
                        ephemeral: true
                    })
            }
    
            return interaction.reply({
                content: `Evento \`${EVENT}\` emitido`,
                ephemeral: true
            })
        } catch (error) {
            console.error(error)
            return interaction.reply({
                content: `Ha ocurrido un error al emitir el evento \`${EVENT}\``,
                ephemeral: true
            })
            
        }
    }
}

