const {EmbedBuilder} = require('discord.js')
module.exports = {
    DESCRIPTION: "Sirve para reproducir DJPANAS",
    async execute(client, message, args, prefix){
        try{
            //CONSTANTES
            const VOICE_CHANNEL = message.member.voice?.channel;
            const CANAL_DISCO = client.channels.cache.get(process.env.ID_CANAL_DISCO);

            //VARIABLES
            let opcion = "Clásico";

            //comprobaciones previas :o
            if (!message.member.voice?.channel){
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR_ERROR)
                            .setDescription(`Tienes que estar en un canal de voz para ejecutar el comando 🤨`)
                    ]
                })
            };
            
            switch(args[0]?.toLowerCase()){
                case "kanako":
                case "kanako ito":{
                    opcion = "Kanako Ito";
                    args = 'https://www.youtube.com/playlist?list=PLtzt-E5Aq1-l_IGzZag1apUv0IA1SKgd7';
                }
                    break;
                case "koncitas":
                case "k on":
                case "kon":{
                    opcion = "K-On";
                    args = 'https://www.youtube.com/playlist?list=PLtzt-E5Aq1-nWkX9uYlGRDEhxUs9z5yf5';
                }
                    break;
                case "mixed":
                case "random":
                case "variado":{
                    opcion = "Variedad";
                    args = 'https://www.youtube.com/playlist?list=PLtzt-E5Aq1-m0PzZ_mvFU9xOOs1JuU-JU';
                }
                    break;
                case "anime":
                case "monas chinas":{
                    opcion = "Anime";
                    args = 'https://www.youtube.com/playlist?list=PLtzt-E5Aq1-lr11mrKlRcLfxYSFw-eSwR';
                }
                    break;
                case "juegos":
                case "video juegos":
                case "videojuegos":
                case "games":
                case "videogames":
                case "video games":{
                    opcion = "Video-juegos";
                    args = 'https://www.youtube.com/playlist?list=PLtzt-E5Aq1-lv_BaSVghN8JGbkHiGEH1n';
                }
                    break;
                case "bochi the rock":
                case "bochitherock":
                case "bochi":{
                    opcion = "Bochi the Rock";
                    args = 'https://www.youtube.com/playlist?list=PLcEg5PtMSB3d5ROEIBnldmOS3ohWKGMLw';
                }
                    break;
                default:{
                    args = 'https://www.youtube.com/playlist?list=PLtzt-E5Aq1-kGOPEbker6rjCQH6ZtKNz9';
                }   
                    break;
            }

            client.distube.play(VOICE_CHANNEL, args,{
                member: message.member,
                textChannel: CANAL_DISCO,
                message
            });

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Reproducción DJ PANAS')
                        .setThumbnail("https://i.imgur.com/vMaawHJ.gif")
                        .setColor(process.env.COLOR)
                        .addFields({name: `**Se agregó DJ PANAS \`${opcion}\` a la lista**`, value:`😎  🔊 🎶`})
                ]
            });
        }catch(e){
            message.reply({content: `**Ha ocurrido un error al recargar el bot**\nMira la consola para mas detalle :P`});
            return console.log(e);
        }
    }   
}