const { Player, useMainPlayer } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');
const { EmbedBuilder } = require('discord.js')
// const { SoundcloudExtractor } = require("discord-player-soundcloud")
const { DeezerExtractor } = require("discord-player-deezer")

const { COLOR } = require('@/config')

module.exports = async (client, _) => {

    client.player = new Player(
        client,
        {
            skipFFmpeg: false,
        }
    )
    const player = useMainPlayer();

    async function setupExtractors() {
        await player.extractors.loadMulti(DefaultExtractors)
        await player.extractors.register(DeezerExtractor, {
            decryptionKey: process.env.DEEZER_DECRYPTION_KEY,
            arl: process.env.DEEZER_ARL
        })
    }

    setupExtractors().catch(err => console.error("Error cargando extractores:", err));

    //eventos
    client.player.events.on("playerStart", async (queue, track) => {

        try {
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle('Reproducción 🔈 🎶')
                .setDescription(`Reproduciendo \`${track.title}\` - \`(${track.duration})\``)
                .setThumbnail(track.thumbnail)
                .setTimestamp()

            queue.metadata.send({ embeds: [embed] })
        } catch (error) {
            console.error(`Error al enviar el mensaje de reproducción: ${error}`);
        }
    })

    client.player.events.on("disconnect", async (queue) => {
        try {
            const embed = new EmbedBuilder()
                .setTitle('Finalización música')
                .setColor(COLOR)
                .addFields({ name: `Saliendo del canal de voz ...`, value: `Hasta la próxima 😊` })
                .setThumbnail('https://i.imgur.com/lIs9ZAg.gif')

            queue.metadata.send({ embeds: [embed] })
        } catch (error) {
            console.error(`Error al enviar mensaje de desconexión: ${error}`);
        }
    });

    client.player.events.on("finish", async (queue) => {
        try {
            const embed = new EmbedBuilder()
                .setTitle('Lista completada')
                .setColor(COLOR)
                .setDescription('Agrega más música para\nseguir reproduciendo')
                .setThumbnail('https://i.imgur.com/PKBROBp.gif')
            queue.metadata.send({ embeds: [embed] })
        } catch (error) {
            console.error(`Error al enviar mensaje de lista completada: ${error}`);
        }
    });

    client.player.events.on("empty", (queue) => {
        try {
            const embed = new EmbedBuilder()
                .setTitle('Canal de voz vacio')
                .setColor(COLOR)
                .addFields({ name: `Canal de voz vacio`, value: `procedo a salirme lentamente ...` })
                .setThumbnail('https://i.imgur.com/L8cJ1fZ.gif')

            queue.metadata.send({ embeds: [embed] })
        } catch (error) {
            console.error(`Error al enviar mensaje de canal vacío: ${error}`);
        }
    });

    client.player.events.on("addList", (queue, track) => {
        try {
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle('Lista de reproducción añadida 🎶')
                .addFields(
                    { name: `Titulo:`, value: `${track.title}`, inline: true },
                    { name: `Artista:`, value: `${track.author}`, inline: true },
                    { name: `Duración:`, value: `${track.duration}`, inline: true }
                )
                .setThumbnail(track.thumbnail)

            queue.metadata.send({ embeds: [embed] })
        } catch (error) {
            console.error(`Error al enviar mensaje de lista añadida: ${error}`);
        }
    });

    client.player.events.on('playerError', (queue, error) => {
        console.error(`[Player Error] Error encontrado en la reproduccion : ${error.message}`);
    });

    client.player.events.on('error', (queue, error) => {
        console.error(`[Player Error] Error encontrado: ${error.message}`);
    });

    client.player.events.on('debug', (queue, message) => {
        console.error(`[Player Debug]: ${message}`)
    });

    console.log(`🎵 Módulo de música cargado`.red)
}