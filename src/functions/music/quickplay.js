const { IDLE_TIMEOUT_MS, MAX_QUEUE_SIZE, DEFAULT_VOLUME, MAX_TRACK_DURATION } = require('@/config')
const { convertDurationToSeconds } = require('@/utils/music_utils')
const { EmbedBuilder } = require('discord.js')
const { COLOR, COLOR_ERROR } = require('@/config')
const { QueryType } = require('discord-player')

module.exports = async (interaction, player, queue, voiceChannel, textChannel, song) => {

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
            requestedBy: interaction.member
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

    if (research && research.tracks) {
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
        research.tracks = filteredTracks
    }

    if (research?.tracks?.length + (queue?.size ?? 0) > MAX_QUEUE_SIZE) {
        return interaction.editReply({
            embeds: [new EmbedBuilder()
                .setColor(COLOR_ERROR)
                .setDescription(`No puedo agregar mas de ${MAX_QUEUE_SIZE} canciones de una playlist.`)
                .setTimestamp()
            ]
        });
    }

    await player.play(interaction.member.voice.channel.id, research, {
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

    return interaction.editReply({
        embeds: [
            new EmbedBuilder()
                .setTitle('Reproducción música')
                .setThumbnail('https://i.imgur.com/WHCwA6t.gif')
                .setColor(COLOR)
                .setDescription(`Mira la lista en el canal ${textChannel}`)
        ]
        , ephemeral: true
    })
}