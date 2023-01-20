const {SlashCommandBuilder, EmbedBuilder,} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Sirve para mezclar las canciónes de la lista"),
    async execute(client, interaction, prefix){
        
        try{
            const voicechannel = interaction.member.voice.channel
            const queue = client.distube.getQueue(voicechannel);

            //comprobaciones previas :o

            if (!queue) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR)
                            .setDescription(`No hay música reproduciendose`)
                    ],
                    ephemeral: true
                })
            };
            
            if (!voicechannel){
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR)
                            .setDescription(`Tienes que estar en un canal de voz para ejecutar el comando 🤨`)
                    ],
                    ephemeral: true
                })
            };

            client.distube.shuffle(voicechannel);
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Mezcla lista música')
                        .setThumbnail('https://i.imgur.com/8L4WreH.gif')
                        .setColor(process.env.COLOR)
                        .addFields({name: `Se mezcló la lista de música`, value:`🎶 😎👍`})
                ]
            })
            
        }catch(e){
            interaction.reply({content: `**Ha ocurrido un error al recargar el bot**\nMira la consola para mas detalle :P`, ephemeral: true});
            return console.log(e);
        }
    } 
       
}