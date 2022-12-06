const { DisTube } = require('distube');
const {SpotifyPlugin} = require('@distube/spotify');
const {SoundCloudPlugin} = require('@distube/soundcloud');
const { EmbedBuilder } = require('discord.js');

module.exports = (client, Discord) => {
    console.log(`Módulo de música cargado`.red)

    client.distube = new DisTube(client, {
        emitNewSongOnly: false,
        leaveOnFinish: true,
        leaveOnStop: true,
        leaveOnEmpty: true,
        savePreviousSongs: true,
        emitAddSongWhenCreatingQueue: false,
        searchSongs: 0,
        nsfw: true,
        emptyCooldown: 100,
        ytdlOptions: {
            highWaterMark: 1024 * 1024 * 64,
            quality: "highestaudio",
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
        
        embed_playsong = new EmbedBuilder()
            .setColor('#871b1b')
            .setTitle('Reproduciendo 🎶')
            .setURL(song.url)
            .setAuthor({ name: song.user.tag, iconURL: song.user.displayAvatarURL({dynamic: true})})
            .setDescription(`Reproduciendo \`${song.name}\` - \`(${song.formattedDuration})\``)
            .setThumbnail(song.thumbnail)

        queue.textChannel.send({ embeds: [embed_playsong] })
        
    })

    client.distube.on("addList", (queue, song) => {
        embed_addlist = new EmbedBuilder()
            .setColor('#871b1b')
            .setTitle('Lista de reproducción añadida 🎶')
            .setURL(song.url)
            .setAuthor({ name: song.user.tag, iconURL: song.user.displayAvatarURL({dynamic: true})})
            .setDescription(`Se añadió \`${song.name}\` - \`(${song.formattedDuration})\``)
            .setThumbnail(song.thumbnail)

        queue.textChannel.send({ embeds: [embed_addlist] })
        
    }); 

    client.distube.on("addSong", (queue, song)=>{
        
        embed_addsong = new EmbedBuilder()
            .setColor('#871b1b')
            .setTitle('Música añadida a la lista 🎶')
            .setURL(song.url)
            .setAuthor({ name: song.user.tag, iconURL: song.user.displayAvatarURL({dynamic: true})})
            .setDescription(`Se añadió \`${song.name}\` - \`(${song.formattedDuration})\``)
            .setThumbnail(song.thumbnail)
        
        queue.textChannel.send({ embeds: [embed_addsong] })
    });

    client.distube.on("noRelated", (queue) => {
        queue.textChannel.send("No se encontró la música indicada 💀")
    });
    client.distube.on("searchInvalidAnswer", (message) => {
        message.channel.send(`El número ingresado es inválido 🤔🏳‍🌈`)
    });

    client.distube.on("searchNoResult", (message, query) =>{
        message.channel.send(`No resultados encontrados en ${query}! 💀`)
    });

    client.distube.on('error', (channel, e) => {
        console.log(`Error encontrado 💀`);
    })
}