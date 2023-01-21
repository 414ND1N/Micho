const { DisTube } = require('distube');
const {SpotifyPlugin} = require('@distube/spotify');
const {SoundCloudPlugin} = require('@distube/soundcloud');
const { EmbedBuilder } = require('discord.js');

module.exports = (client, Discord) => {
    console.log(`Módulo de música cargado`.red)

    client.distube = new DisTube(client, {
        emitNewSongOnly: false,
        leaveOnFinish: false,
        leaveOnStop: true,
        leaveOnEmpty: true,
        savePreviousSongs: true,
        emitAddSongWhenCreatingQueue: false,
        searchSongs: 0,
        nsfw: true,
        emptyCooldown: 60,
        ytdlOptions: {
            highWaterMark: 1024 * 1024 * 64,
            quality: "135",
            format: "audioonly",
            liveBuffer: 20000,
            dlChunkSize: 1024 * 1024 * 4,
        },
        
        plugins: [
            new SpotifyPlugin({
                parallel: true,
                emitEventsAfterFetching: true,
            }),
            new SoundCloudPlugin()
        ],


    });

    //eventos de distube
    client.distube.on("playSong", (queue, song)=>{
        
        embed = new EmbedBuilder()
            .setColor(process.env.COLOR)
            .setTitle('Reproducción 🔈 🎶')
            .setURL(song.url)
            .setDescription(`Reproduciendo \`${song.name}\` - \`(${song.formattedDuration})\``)
            .setThumbnail(song.thumbnail)

        queue.textChannel.send({ embeds: [embed] })
        
    })

    client.distube.on("addList", (queue, song) => {
        embed = new EmbedBuilder()
            .setColor(process.env.COLOR)
            .setTitle('Lista de reproducción añadida 🎶')
            .setURL(song.url)
            .setAuthor({ name: song.user.tag, iconURL: song.user.displayAvatarURL({dynamic: true})})
            .setDescription(`Se añadió \`${song.name}\` - \`(${song.formattedDuration})\``)
            .setThumbnail(song.thumbnail)

        queue.textChannel.send({ embeds: [embed] })
        
    }); 

    client.distube.on("empty", (queue)=>{
        
        embed = new EmbedBuilder()
            .setTitle('Finalización música')
            .setColor(process.env.COLOR)
            .setDescription(`No hay nadie en la sala de voz,\nprocedo a salirme lentamente ...`)
            .setThumbnail('https://i.imgur.com/L8cJ1fZ.gif')
        
        queue.textChannel.send({ embeds: [embed] })
    });

    client.distube.on("finish", (queue)=>{
        
        embed = new EmbedBuilder()
            .setTitle('Lista completada')
            .setColor(process.env.COLOR)
            .setDescription('Agrega más música para\nseguir reproduciendo')
            .setThumbnail('https://i.imgur.com/PKBROBp.gif')
        queue.textChannel.send({ embeds: [embed] })
    }); 

    client.distube.on("disconnect", (queue)=>{
        
        embed = new EmbedBuilder()
            .setTitle('Finalización música')
            .setColor(process.env.COLOR)
            .addFields({name: `Saliendo del canal ...`, value:`Hasta la próxima 😊`})
            .setThumbnail('https://i.imgur.com/lIs9ZAg.gif')
        
        queue.textChannel.send({ embeds: [embed] })
    });

    client.distube.on("noRelated", (queue) => {
        queue.textChannel.send("No se encontró un video similar para reproducir")
    });
    client.distube.on("searchInvalidAnswer", (message) => {
        message.channel.send(`la busqueda ingresada no es valida 🤔`)
    });

    client.distube.on("searchNoResult", (message, query) =>{
        message.channel.send(`No resultados encontrados en ${query}! 💀`)
    });

    client.distube.on('error', (channel, e) => {
        console.log(`Error encontrado 💀`);
    });

    /*
    client.distube.on('searchResult', (message, results) => {
        message.channel.send(`**Elíge entre las opciones*\n${
            results.map((song, i) => `**${i + 1}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")
        }\n*Enter anything else or wait 60 seconds to cancel*`);
    });
    */
}