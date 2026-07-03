const { IDLE_TIMEOUT_MS, MAX_QUEUE_SIZE, DEFAULT_VOLUME, MAX_TRACK_DURATION } = require('@/config')
const { convertDurationToSeconds } = require('@/utils/music_utils')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js')
const { COLOR, COLOR_ERROR } = require('@/config')
const { QueryType } = require('discord-player')

module.exports = async (interaction, player, queue, voiceChannel, textChannel, song, source) => {

    let selectedSearchEngine = QueryType.AUTO_SEARCH
    if (source === 'deezer') {
        selectedSearchEngine = QueryType.DEEZER_SONG
    } else if (source === 'soundcloud') {
        selectedSearchEngine = QueryType.SOUNDCLOUD_TRACK
    }

    if (queue && queue.isPlaying()) {
        let interaccionuser = interaction.member.voice.channel.id;
        let interaccionclient = interaction.guild.members.me.voice.channel.id;
        if (interaccionclient != interaccionuser) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(COLOR_ERROR)
                        .setDescription(`Tienes que estar en el mismo canal de voz que yo para ejecutar el comando 🤨`)
                ],
                ephemeral: true
            })
        }
    }

    const botVoiceChannel = interaction.guild.members.me.voice.channel;
    if (botVoiceChannel && botVoiceChannel.id !== voiceChannel.id) {
        if (!queue || !queue.isPlaying() || queue.tracks.size === 0) {
            await interaction.guild.members.me.voice.disconnect()
            await player.voiceUtils.join(voiceChannel)
        } else {
            return interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setColor(COLOR_ERROR)
                    .setDescription('Ya estoy reproduciendo música en otro canal de voz, por favor únete a ese canal para escuchar la música.')
                    .setThumbnail('https://i.imgur.com/L8cJ1fZ.gif')
                    .setTimestamp()]
            })
        }
    }

    let research
    try {
        research = await player.search(song, {
            requestedBy: interaction.member,
            searchEngine: selectedSearchEngine,
        })

        if (!research.hasTracks()) {
            return interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setColor(COLOR_ERROR)
                    .setDescription('No he podido encontrar resultados')
                    .setThumbnail('https://i.imgur.com/L8cJ1fZ.gif')
                    .setTimestamp()
                ]
            })
        }
    } catch (e) {
        return interaction.followUp(`Something went wrong: ${e}`);
    }

    if (!research || !research.tracks || research.tracks.length === 0) {
        return interaction.editReply({
            embeds: [new EmbedBuilder()
                .setColor(COLOR_ERROR)
                .setDescription('No he podido encontrar resultados')
                .setThumbnail('https://i.imgur.com/L8cJ1fZ.gif')
                .setTimestamp()
            ]
        })
    }


    if (research.playlist) {
        if (research.tracks.length + (queue?.size ?? 0) > MAX_QUEUE_SIZE) {
            return interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setColor(COLOR_ERROR)
                    .setDescription(`No puedo agregar mas de ${MAX_QUEUE_SIZE} canciones de una playlist.`)
                    .setTimestamp()
                ]
            });
        }
    }


    // Filter out tracks that exceed the duration limit
    const filteredTracks = research.tracks.filter(track => {
        const durationInSeconds = convertDurationToSeconds(track.duration)
        return durationInSeconds <= MAX_TRACK_DURATION
    })

    if (filteredTracks.length === 0 && research.tracks.length > 0) {
        return interaction.editReply({
            embeds: [new EmbedBuilder()
                .setColor(COLOR_ERROR)
                .setDescription('Lo siento, no pude encontrar lo que buscaste')
                .setThumbnail('https://i.imgur.com/L8cJ1fZ.gif')
                .setTimestamp()
            ]
        });
    }

    const choices = filteredTracks.slice(0, 10) // Limitar a las primeras 10 canciones

    const buildTrackEmbed = (track, currentIndex, total) => {
        return new EmbedBuilder()
            .setColor(COLOR)
            .setTitle('Selecciona una canción')
            .setDescription(`**${track.title}**\nPor: ${track.author}`)
            .addFields(
                { name: 'Duración', value: `${track.duration}`, inline: true },
                { name: 'Resultado', value: `${currentIndex + 1} / ${total}`, inline: true }
            )
            .setThumbnail(track.thumbnail || 'https://i.imgur.com/WHCwA6t.gif')
            .setTimestamp()
    }

    const prev = new ButtonBuilder()
        .setCustomId('prev')
        .setStyle(ButtonStyle.Success)
        .setEmoji('⬅')

    const next = new ButtonBuilder()
        .setCustomId('next')
        .setStyle(ButtonStyle.Success)
        .setEmoji('➡')

    const select = new ButtonBuilder()
        .setCustomId('select')
        .setLabel('Seleccionar')
        .setStyle(ButtonStyle.Primary)

    const cancel = new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('Cancelar')
        .setStyle(ButtonStyle.Danger)

    const buttonsRow = new ActionRowBuilder()
    if (choices.length < 3) {
        buttonsRow.addComponents(prev, next, select, cancel)
    } else {
        buttonsRow.addComponents(prev, next, select, cancel)
    }

    let index = 0
    let hasSelectedTrack = false

    const menuEmbed = await interaction.editReply({
        embeds: [buildTrackEmbed(choices[index], index, choices.length)],
        components: [buttonsRow],
        ephemeral: true
    })

    const filter = await menuEmbed.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 30 * 1000
    })

    filter.on('collect', async (i) => {
        if (i?.user.id != interaction.user.id) {
            return i?.reply({
                content: `❌ Solo quien uso el comando puede navegar entre categorías.`,
                ephemeral: true
            })
        }

        switch (i.customId) {
            case 'prev':
                filter.resetTimer()
                index = index > 0 ? --index : choices.length - 1
                await i.update({
                    embeds: [buildTrackEmbed(choices[index], index, choices.length)],
                    components: [buttonsRow]
                }).catch((e) => { console.error(e) })
                // research.tracks = choices[index]
                return
            case 'next':
                filter.resetTimer()
                index = index + 1 < choices.length ? ++index : 0
                await i.update({
                    embeds: [buildTrackEmbed(choices[index], index, choices.length)],
                    components: [buttonsRow]
                }).catch((e) => { console.error(e) })
                // research.tracks = choices[index]
                return
            case 'cancel':
                await i.deferUpdate().catch(() => null)
                filter.stop('cancelled')
                return
            case 'select':
                await i.deferUpdate().catch(() => null)
                hasSelectedTrack = true
                const selectedTrack = choices[index]
                try {
                    await player.play(interaction.member.voice.channel.id, selectedTrack, {
                        nodeOptions: {
                            metadata: textChannel,
                            volume: DEFAULT_VOLUME * 100,
                            maxSize: MAX_QUEUE_SIZE,
                            bufferingTimeout: 3000,
                            leaveOnStop: false,
                            leaveOnStopCooldown: 60 * 1000, // 60 segundos
                            leaveOnEnd: false,
                            leaveOnEmpty: false,
                            leaveOnEmptyCooldown: IDLE_TIMEOUT_MS,
                            disableVolume: false, // Permitir el control de volumen
                            smoothVolume: true // Habilitar el control de volumen suave
                        },
                    })
                } catch (error) {
                    hasSelectedTrack = false
                    filter.stop('error')
                    return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(COLOR_ERROR)
                                .setDescription('No se pudo reproducir la canción seleccionada.')
                        ],
                        components: [],
                        ephemeral: true
                    })
                }
                break
            default:
                return
        }
        filter.stop('selected')
    })

    filter.on('end', async (_, reason) => {
        if (hasSelectedTrack || reason === 'selected') {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Reproducción música')
                        .setThumbnail('https://i.imgur.com/WHCwA6t.gif')
                        .setColor(COLOR)
                        .setDescription(`Mira la lista en el canal ${textChannel}`)
                ],
                components: [],
                ephemeral: true
            })
        } 
        interaction.deleteReply().catch(() => null)
    })


}