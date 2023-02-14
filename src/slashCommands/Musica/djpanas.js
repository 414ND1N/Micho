const {SlashCommandBuilder, EmbedBuilder,} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Sirve para reproducir DJPANAS")
    .addStringOption(option =>
        option.setName("tipo")
        .setDescription("Tipo de contenido")
        .addChoices(
            {name: "Clásico", value:"classic"},
            {name: "Anime", value:"anime"},
            {name: "Video-juegos", value:"videogames"},
            {name: "K-On", value:"kon"},
            {name: "Bochi the Rock", value:"bochi"},
            {name: "Kanako Ito", value:"kanako"},
            {name: "Variedad", value:"random"},
        )
    ),
    async execute(client, interaction, prefix){
        try{
            let tipo = interaction.options.getString("tipo");
            let opcion = "Clásico";
            let args = 'https://www.youtube.com/playlist?list=PLtzt-E5Aq1-kGOPEbker6rjCQH6ZtKNz9'
    
            const voicechannel = interaction.member.voice.channel;
            const CANAL_DISCO = client.channels.cache.get(process.env.ID_CANAL_DISCO);

            //comprobaciones previas :o
            if (!voicechannel) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR_ERROR)
                            .setDescription(`Tienes que estar en un canal de voz para ejecutar el comando 🤨`)
                    ],
                    ephemeral: true
                })
            }
            switch(tipo){
                case "kanako":{
                    opcion = "Kanako ito";
                    args = 'https://www.youtube.com/playlist?list=PLtzt-E5Aq1-l_IGzZag1apUv0IA1SKgd7';
                }
                    break;
                case "kon":{
                    opcion = "K-On";
                    args = 'https://www.youtube.com/playlist?list=PLtzt-E5Aq1-nWkX9uYlGRDEhxUs9z5yf5';
                }
                    break;
                case "random":{
                    opcion = "Variedad";
                    args = 'https://www.youtube.com/playlist?list=PLtzt-E5Aq1-m0PzZ_mvFU9xOOs1JuU-JU';
                }
                    break;
                case "anime":{
                    opcion = "Anime";
                    args = 'https://www.youtube.com/playlist?list=PLtzt-E5Aq1-lr11mrKlRcLfxYSFw-eSwR';
                }
                    break;
                case "videogames":{
                    opcion = "Video-juegos";
                    args = 'https://www.youtube.com/playlist?list=PLtzt-E5Aq1-lv_BaSVghN8JGbkHiGEH1n';
                }
                    break;
                case "bochi":{
                    opcion = "Bochi the Rock";
                    args = 'https://www.youtube.com/playlist?list=PLcEg5PtMSB3d5ROEIBnldmOS3ohWKGMLw';
                }
                    break;
                default: 
                    break;
            }

            client.distube.play(voicechannel, args,{
                member: interaction.member,
                textChannel: CANAL_DISCO
            });

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Reproducción DJ PANAS')
                        .setThumbnail("https://i.imgur.com/vMaawHJ.gif")
                        .setColor(process.env.COLOR)
                        .addFields({name: `**Se agregó DJ PANAS \`${opcion}\` a la lista**`, value:`😎  🔊 🎶`})
                ]
            })

        }catch(e){
            interaction.reply({content: `**Ha ocurrido un error al recargar el bot**\nMira la consola para mas detalle :P`, ephemeral: true});
            return console.log(e);
        } 
    } 
}