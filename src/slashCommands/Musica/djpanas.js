const {SlashCommandBuilder, EmbedBuilder,} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Sirve para reproducir DJPANAS")
    .addStringOption(option =>
        option.setName("tipo")
        .setDescription("Tipo de contenido")
        .addChoices(
            {name: "Kanako Ito", value:"kanako"},
            {name: "Anime", value:"anime"},
            {name: "Video-juegos", value:"videogames"},
            {name: "K-On", value:"kon"},
            {name: "Variedad", value:"random"},
            {name: "Clásico", value:"classic"},
        )
    ),
    async execute(client, interaction, prefix){
        try{
            let args = interaction.options.getString("tipo");
            let opcion = "Clásico";
    
            const voicechannel = interaction.member.voice.channel
            //comprobaciones previas :o
            
            if (!voicechannel) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR)
                            .setDescription(`Tienes que estar en un canal de voz para ejecutar el comando 🤨`)
                    ],
                    ephemeral: true
                })
            }
            switch(args?.toLowerCase()){
                case "kanako":{
                    opcion = "Kanako ito";
                    args = 'https://www.youtube.com/playlist?list=PLtzt-E5Aq1-l_IGzZag1apUv0IA1SKgd7'
                }
                    break;
                case "kon":{
                    opcion = "K-On";
                    args = 'https://www.youtube.com/playlist?list=PLtzt-E5Aq1-nWkX9uYlGRDEhxUs9z5yf5'
                }
                    break;
                case "random":{
                    opcion = "Variedad";
                    args = 'https://www.youtube.com/playlist?list=PLtzt-E5Aq1-m0PzZ_mvFU9xOOs1JuU-JU'
                }
                    break;
                case "anime":{
                    opcion = "Anime";
                    args = 'https://www.youtube.com/playlist?list=PLtzt-E5Aq1-lr11mrKlRcLfxYSFw-eSwR'
                }
                    break;
                case "videogames":{
                    opcion = "Video-juegos";
                    args = 'https://www.youtube.com/playlist?list=PLtzt-E5Aq1-lv_BaSVghN8JGbkHiGEH1n'
                }
                    break;
                default:{
                    args = 'https://www.youtube.com/playlist?list=PLtzt-E5Aq1-kGOPEbker6rjCQH6ZtKNz9'
                }   
                    break;
            }

            client.distube.play(voicechannel, args,{
                member: interaction.member,
                textChannel: interaction.channel
            });
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .addFields({name: `**Reproduciendo DJPANAS ${opcion} **`, value:`> 😎`})
                ]
            })

        }catch(e){
            interaction.reply({content: `**Ha ocurrido un error al recargar el bot**\nMira la consola para mas detalle :P`});
            console.log(e);
            return;
        }

       
    } 
       
}