const { DisTube } = require('distube');
const { EmbedBuilder } = require('discord.js');
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { YouTubePlugin } = require("@distube/youtube");

module.exports = (client, _) => {

    //definir plugins
    const youtubePlugin = new YouTubePlugin({
        ytdlOptions: {
            //highWaterMark: 1024 * 1024 * 64,
            //quality: "lowestaudio",
            format: "audioonly",
            //liveBuffer: 20000,
            //dlChunkSize: 1024 * 1024 * 2,
        },
    });

    //definir el distube
    client.distube = new DisTube(client, {
        emitNewSongOnly: false,
        //leaveOnFinish: false,
        //leaveOnStop: true,
        //leaveOnEmpty: true,
        //emptyCooldown: 60,
        savePreviousSongs: true,
        emitAddSongWhenCreatingQueue: false,
        //searchSongs: 0,
        //searchCooldown: 60,
        nsfw: true,
        joinNewVoiceChannel: false,
        plugins: [
            new YtDlpPlugin({ 
                update: true 
            }),
            youtubePlugin
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
            .setTitle('Canal de voz vacio')
            .setColor(process.env.COLOR)
            .addFields({name: `Canal de voz vacio`, value:`procedo a salirme lentamente ...`})
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

    client.distube.on("initQueue", queue => {
        queue.volume = 80;
    });

    client.distube.on("disconnect", (queue)=>{

        embed = new EmbedBuilder()
            .setTitle('Finalización música')
            .setColor(process.env.COLOR)
            .addFields({name: `Saliendo del canal de voz ...`, value:`Hasta la próxima 😊`})
            .setThumbnail('https://i.imgur.com/lIs9ZAg.gif')
        
        queue.textChannel.send({ embeds: [embed] })
    });

    client.distube.on("noRelated", (queue) => {
        queue.textChannel.send("No se encontró un música similar para reproducir")
    });
    
    client.distube.on("searchInvalidAnswer", (message) => {
        message.channel.send(`La busqueda no es valida`)
    });

    client.distube.on("searchNoResult", (message, query) =>{
        message.channel.send(`No resultados encontrados en ${query}! 💀`)
    });

    client.distube.on('error', (e, channel, song) => {
        console.log(`Error encontrado en distube:`.red);
        console.log(e)
    });

    /*
    client.distube.on('searchResult', (message, results) => {
        message.channel.send(`**Elíge entre las opciones*\n${
            results.map((song, i) => `**${i + 1}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")
        }\n*Enter anything else or wait 60 seconds to cancel*`);
    });
    */
    console.log(`Módulo de música cargado`.red)
}