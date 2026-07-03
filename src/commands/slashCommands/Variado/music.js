const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { COLOR_ERROR } = require('@/config')
const { useMainPlayer, useQueue } = require('discord-player')
const Channels = require('@/schemas/channels')

const playFunction = require('@/functions/music/play')
const stopFunction = require('@/functions/music/stop')
const clearFunction = require('@/functions/music/clear')
const controlFunction = require('@/functions/music/control')
const queueFunction = require('@/functions/music/queue')
const volumeFunction = require('@/functions/music/volume')
const quickPlayFunction = require('@/functions/music/quickplay')
const loopFunction = require('@/functions/music/loop')

module.exports = {
    cooldown: 5,
    CMD: new SlashCommandBuilder()
        .setName("musica")
        .setNameLocalizations({
            "en-US": "music"
        })
        .setDescription("Control de la reproducción de música")
        .setDescriptionLocalizations({
            "en-US": "Music playback control"
        })
        .addSubcommand(subcommand =>
            subcommand.setName('reproducir')
                .setNameLocalizations({ "en-US": 'play' })
                .setDescription('Reproduce una canción')
                .setDescriptionLocalizations({
                    "en-US": 'Play a song'
                })
                .addStringOption(option =>
                    option.setName('consulta')
                        .setNameLocalizations({ "en-US": 'query' })
                        .setDescription('Canción a reproducir (url o nombre)')
                        .setDescriptionLocalizations({
                            "en-US": 'Song to play (url or name)'
                        })
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('origen')
                        .setNameLocalizations({ "en-US": 'source' })
                        .setDescription('Origen de la canción')
                        .setDescriptionLocalizations({
                            "en-US": 'Song source'
                        })
                        .addChoices(
                            { name: 'Deezer', value: 'deezer' },
                            { name: 'SoundCloud', value: 'soundcloud' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('busquedarapida')
                .setNameLocalizations({ "en-US": 'quicksearch' })
                .setDescription('Reproduce una canción de manera rápida')
                .setDescriptionLocalizations({
                    "en-US": 'Play a song quickly'
                })
                .addStringOption(option =>
                    option.setName('consulta')
                        .setNameLocalizations({ "en-US": 'query' })
                        .setDescription('Canción a reproducir (url o nombre)')
                        .setDescriptionLocalizations({
                            "en-US": 'Song to play (url or name)'
                        })
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('origen')
                        .setNameLocalizations({ "en-US": 'source' })
                        .setDescription('Origen de la canción')
                        .setDescriptionLocalizations({
                            "en-US": 'Song source'
                        })
                        .addChoices(
                            { name: 'Deezer', value: 'deezer' },
                            { name: 'SoundCloud', value: 'soundcloud' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('detener')
                .setNameLocalizations({ "en-US": 'stop' })
                .setDescription('Detiene la reproducción de la música')
                .setDescriptionLocalizations({
                    "en-US": 'Stop music playback'
                })
        )
        .addSubcommand(subcommand =>
            subcommand.setName('cola')
                .setNameLocalizations({ "en-US": 'queue' })
                .setDescription('Lista la música que está en la cola de reproducción')
                .setDescriptionLocalizations({
                    "en-US": 'List the music that is in the playback queue'
                })
                .addStringOption(option =>
                    option.setName('tipo')
                        .setNameLocalizations({
                            "en-US": 'type'
                        })
                        .setDescription('Tipo de cola a mostrar')
                        .setDescriptionLocalizations({
                            "en-US": 'Type of queue to show'
                        })
                        .addChoices(
                            { name: 'Actual', value: 'current' },
                            { name: 'Historial', value: 'history' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('volumen')
                .setNameLocalizations({ "en-US": 'volume' })
                .setDescription('Volumen para la música en reproducción')
                .setDescriptionLocalizations({
                    "en-US": 'Volume for music playback'
                })
                .addNumberOption(option =>
                    option.setName('porcentaje')
                        .setDescription('Porcentaje para la música en reproducción')
                        .setDescriptionLocalizations({
                            "en-US": 'Percentage for music playback'
                        })
                        .setRequired(true)
                        .setMinValue(0)
                        .setMaxValue(100)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('controlar')
                .setNameLocalizations({ "en-US": 'control' })
                .setDescription('Controlar la música en reproducción')
                .setDescriptionLocalizations({
                    "en-US": 'Control the music playing'
                })
        )
        .addSubcommand(subcommand =>
            subcommand.setName('limpiar')
                .setNameLocalizations({ "en-US": 'clear' })
                .setDescription('Limpia la cola de reproducción')
                .setDescriptionLocalizations({
                    "en-US": 'Clear the playback queue'
                })
        )
        .addSubcommand(subcommand =>
            subcommand.setName('bucle')
                .setNameLocalizations({ "en-US": 'loop' })
                .setDescription('Controla el bucle de la música en reproducción')
                .setDescriptionLocalizations({
                    "en-US": 'Control the loop of the music playing'
                })
                .addStringOption(option =>
                    option.setName('tipo')
                        .setNameLocalizations({
                            "en-US": 'type'
                        })
                        .setDescription('Tipo de bucle a establecer')
                        .setDescriptionLocalizations({
                            "en-US": 'Type of loop to set'
                        })
                        .addChoices(
                            { name: 'Canción', value: 'song' },
                            { name: 'Cola', value: 'queue' },
                            { name: 'Desactivar', value: 'off' },
                            { name: 'Automático', value: 'autoplay' }
                        )
                )
        )
    ,
    /**
    * @param {ChatInputCommandInteraction} interaction
    */
    async execute(interaction) {
        //constantes
        const player = useMainPlayer()
        const subcommand = interaction.options.getSubcommand()
        const userVoiceChannel = interaction.member.voice?.channel ?? null //Canal de voz
        const queue = useQueue(interaction.guildId)

        // Buscar el rol en la bd con el guildID y el nombre
        const channelSearch = await Channels.findOne({ guild_id: interaction.guild.id, key: "music_queue" })
        let channel = interaction.channel
        if (channelSearch) {
            channel = await interaction.guild.channels.cache.find(channel => channel.id === channelSearch.channel_id)
            await channel.fetch()
        }

        //Comprobaciones previas y que no sea un comando que no lo necesite
        if (!userVoiceChannel) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLOR_ERROR)
                        .setDescription(`Tienes que estar en un canal de voz para ejecutar el comando 🤨`)
                ],
                ephemeral: true
            })
        }

        await interaction.deferReply({ ephemeral: true })

        try {
            switch (subcommand) {
                case 'reproducir': //Subcommand
                    const songPlay = interaction.options.getString('consulta')
                    const sourcePlay = interaction.options.getString('origen') || 'auto'
                    playFunction(interaction, player, queue, userVoiceChannel, channel, songPlay, sourcePlay)
                    break
                case 'busquedarapida': //Subcommand
                    const songQuickplay = interaction.options.getString('consulta')
                    const sourceQuickplay = interaction.options.getString('origen') || 'auto'
                    quickPlayFunction(interaction, player, queue, userVoiceChannel, channel, songQuickplay, sourceQuickplay)
                    break
                case 'detener': //Subcommand
                    stopFunction(interaction, queue, userVoiceChannel)
                    break
                case 'controlar': //Subcommand
                    controlFunction(interaction, queue, userVoiceChannel)
                    break
                case 'cola': //Subcommand
                    const queueType = interaction.options.getString('tipo') ?? 'current'
                    queueFunction(interaction, queue, userVoiceChannel, queueType)
                    break
                case 'volumen': //Subcommand
                    const desiredVolume = interaction.options.getNumber('porcentaje') ?? 50
                    volumeFunction(interaction, queue, userVoiceChannel, desiredVolume)
                    break
                case 'clear': //Subcommand
                    clearFunction(interaction, queue, userVoiceChannel)
                    break
                case 'bucle': //Subcommand
                    const loopType = interaction.options.getString('tipo') ?? 'song'
                    loopFunction(interaction, queue, userVoiceChannel, loopType)
                    break
                default:
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(COLOR_ERROR)
                                .setDescription(`Comando no reconocido 🤨`)
                        ],
                        ephemeral: true
                    })
            }
        } catch (error) {
            console.log(`Error al ejecutar el subcomando de música: ${error}`)
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLOR_ERROR)
                        .setDescription(`❌ Error al reproducir: ${error.message || 'Error desconocido'}`)
                ]
                , ephemeral: true
            })
        }
    }
}  