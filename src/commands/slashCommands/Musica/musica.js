const { SlashCommandBuilder, EmbedBuilder} = require('discord.js')

const handleMusicPlay = require('../../../utils/Musica/handle_play.js')
const handleMusicControl  = require('../../../utils/Musica/handle_control')
const handleMusicQueue = require('../../../utils/Musica/handle_queue.js')
const handleMusicRepeat = require('../../../utils/Musica/handle_repeat.js')

module.exports = {
    cooldown: 10,
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
                    option.setName('cancion')
                        .setNameLocalizations({ "en-US": 'song' })
                        .setDescription('Canción a reproducir (url o nombre)')
                        .setDescriptionLocalizations({
                            "en-US": 'Song to play (url or name)'
                        })
                        .setRequired(true)
                )
                .addBooleanOption(option =>
                    option.setName('saltar')
                        .setNameLocalizations({ "en-US": 'jump' })
                        .setDescription('Saltar la cola directamente a la nueva/s cancion/es')
                        .setDescriptionLocalizations({
                            "en-US": 'Skip the queue directly to the new song/s'
                        })
                        .setRequired(false)
                )
                .addBooleanOption(option =>
                    option.setName('nueva')
                        .setNameLocalizations({ "en-US": 'new' })
                        .setDescription('Crear una nueva cola de reproducción con la/s nueva/s canción/es')
                        .setDescriptionLocalizations({
                            "en-US": 'Create a new playback queue with the new song/s'
                        })
                        .setRequired(false)
                )
                .addBooleanOption(option =>
                    option.setName('mezclar')
                        .setNameLocalizations({ "en-US": 'shuffle' })
                        .setDescription('Mezclar la cola de reproducción')
                        .setDescriptionLocalizations({
                            "en-US": 'Shuffle the playback queue'
                        })
                        .setRequired(false)
                )
                .addNumberOption(option =>
                    option.setName('volumen')
                        .setNameLocalizations({ "en-US": 'volume' })
                        .setDescription('Volumen de la reproducción')
                        .setDescriptionLocalizations({
                            "en-US": 'Playback volume'
                        })
                        .setRequired(false)
                        .setMinValue(0)
                        .setMaxValue(100)
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
            subcommand.setName('reproduciendo')
                .setNameLocalizations({ "en-US": 'playing' })
                .setDescription('Muestra información de la canción que se está reproduciendo')
                .setDescriptionLocalizations({
                    "en-US": 'Show information about the song that is playing'
                })
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
            subcommand.setName('cola')
                .setNameLocalizations({ "en-US": 'queue' })
                .setDescription('Lista la música que está en la cola de reproducción')
                .setDescriptionLocalizations({
                    "en-US": 'List the music that is in the playback queue'
                })
        )
        .addSubcommand(subcommand =>
            subcommand.setName('saltar')
                .setNameLocalizations({ "en-US": 'skip' })
                .setDescription('Saltar a una canción de la lista en reproducción')
                .setDescriptionLocalizations({
                    "en-US": 'Skip to a song on the playback list'
                })
                .addNumberOption(option =>
                    option.setName('poscicion')
                        .setNameLocalizations({ "en-US": 'position' })
                        .setDescription('Número de la canción en la lista')
                        .setDescriptionLocalizations({
                            "en-US": 'Song number on the list'
                        })
                        .setRequired(true)
                        .setMinValue(2)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('repeticion')
                .setNameLocalizations({ "en-US": 'repeat' })
                .setDescription('Controlar el comportamiento de la cola de reproducción')
                .setDescriptionLocalizations({
                    "en-US": 'Control the behavior of the playback queue'
                })
        ),

    async execute(client, interaction) {
        //constantes
        const SUB = interaction.options.getSubcommand()
        const channel = client.channels.cache.get(process.env.ID_CANAL_DISCO)
        const COM_NO_QUEUE = ['detener', 'reproducir'] //Comandos que no necesitan una cola de reproducción
        const COM_NO_DEFER = ['cola', 'reproducir', 'controlar', 'repeticion'] //Comandos que no necesitan un deferReply
        const VOICE_CHANNEL = interaction.member.voice?.channel ?? null //Canal de voz

        //Comprobaciones previas y que no sea un comando que no lo necesite
        if (!VOICE_CHANNEL) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR_ERROR)  
                        .setDescription(`Tienes que estar en un canal de voz para ejecutar el comando 🤨`)
                ],
                ephemeral: true
            })
        }

        const QUEUE = await client.distube.getQueue(VOICE_CHANNEL) ?? null //Cola de reproducción

        //Verificar si hay una cola de reproducción y que no sea un comando que no lo necesite
        if (!QUEUE && !COM_NO_QUEUE.includes(SUB)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR_ERROR)
                        .setDescription(`No hay música en reproducción para ejecutar este comando`)
                ],
                ephemeral: true
            })
        }

        // Veruficar si el comando usa pagination, en dado caso no se hace un deferReply
        if (!COM_NO_DEFER.includes(SUB)) {
            // Defer para respuestas de más de 3 segundos
            await interaction.deferReply({ ephemeral: true })
        }

        // Accion a realizar segun el subcomando

        try {
            switch (SUB) {
                case 'reproducir': //Subcommand
                    handleMusicPlay(interaction, client, VOICE_CHANNEL, QUEUE, channel)
                    break
                case 'detener':
                    if (!QUEUE) {
                        // Salir del canal de voz
                        await client.distube.voices.leave(VOICE_CHANNEL)
                    }else{
                        // Parar la reproducción y salir del canal de voz
                        await client.distube.stop(VOICE_CHANNEL)
                    }
                    
                    return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Detener música')
                                .setThumbnail('https://i.imgur.com/WnsPmQz.gif')
                                .setColor(process.env.COLOR)
                                .setDescription(`Se detuvo la reproducción de música en el canal ${VOICE_CHANNEL}`)
                        ]
                        , ephemeral: true
                    })
                    
                case 'reproduciendo':
    
                    function getTimeString(time) {
                        const minutes = Math.floor(time / 60)
                        const seconds = Math.round(time % 60)
                        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                        return timeString
                    }
    
                    const cancion_actual = QUEUE.songs[0]
                    const tiempo_reproduccion = getTimeString(QUEUE.currentTime)
                    const tiempo_total = cancion_actual.formattedDuration
                    const tiempo_formateado = `${tiempo_reproduccion} / ${tiempo_total}`
    
                    if( QUEUE.songs[0].isLive) {
                        tiempo_formateado = '🔴 LIVE'
                    }
    
                    return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Canción reproduciendose')
                                .setColor(process.env.COLOR)
                                .setDescription(`\`${cancion_actual.name}\``)
                                .setThumbnail(cancion_actual.thumbnail)
                                .setURL(cancion_actual.url)
                                .addFields(
                                    { name: `👁 Vistas`, value: `\`${cancion_actual.views}\``, inline: true },
                                    { name: `⏳ Tiempo`, value: `\`${tiempo_formateado}\``, inline: true }
                                )
                                .setFooter({ text: `👍 ${cancion_actual.likes} / 👎 ${cancion_actual.dislikes}` })
                        ],
                        ephemeral: true
                    })
                case 'saltar':
                    const poscicion = interaction.options.getNumber('poscicion')
    
                    //Comprobaciones previas
                    if (poscicion > (QUEUE.songs.length)) {
                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(process.env.COLOR_ERROR)
                                    .setDescription(`La lista unicamente cuenta con \`${QUEUE.songs.length}\` canciones`)
                            ],
                            ephemeral: true
                        })
                    }
    
                    client.distube.jump(VOICE_CHANNEL, poscicion - 1)
                    return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Salto en lista de música')
                                .setColor(process.env.COLOR)
                                .setThumbnail('https://i.imgur.com/bDO4VTw.gif')
                                .addFields({ name: `Se saltó a la canción número \`${poscicion}\``, value: `🐱‍🏍 🎶🎵` })
                        ],
                        ephemeral: true
                    })       
                case 'volumen':
                    const porcentaje = interaction.options.getNumber('porcentaje')
                    const volumen_previo = QUEUE.volume
    
                    client.distube.setVolume(VOICE_CHANNEL, porcentaje)
    
                    if (volumen_previo <= porcentaje){ //Se aumentó el volumen
                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle('Volúmen música')
                                    .setColor(process.env.COLOR)
                                    .addFields({ name: `Se cambió el volúmen de \`${volumen_previo} %\` a \`${porcentaje} %\``, value: `🔈🔉 🔊` })
                                    .setThumbnail('https://i.imgur.com/bDO4VTw.gif')
                            ],
                            ephemeral: true
                        })
                    } else { //Se disminuyó el volumen
                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle('Volúmen música')
                                    .setColor(process.env.COLOR)
                                    .addFields({ name: `Se cambió el volúmen de \`${volumen_previo} %\` a \`${porcentaje} %\``, value: `🔈🔉 🔊` })
                                    .setThumbnail('https://i.imgur.com/9fBJ0s7.gif')
                            ],
                            ephemeral: true
                        })
                    }
                // Comandos con collector
                case 'controlar': //Subcommand
                    handleMusicControl(interaction, client, VOICE_CHANNEL, QUEUE)
                    break
    
                case 'repeticion': //Subcommand
                    handleMusicRepeat(interaction, client, VOICE_CHANNEL)
                    break
    
                case 'cola': //Subcommand
                    handleMusicQueue(interaction, QUEUE)
                    break
       
            }
        } catch (error) {
            console.error(error)
        }
    }
}  