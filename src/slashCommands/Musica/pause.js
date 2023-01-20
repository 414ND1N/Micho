const {SlashCommandBuilder, EmbedBuilder,} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Sirve para pausar la música en reproducción"),
    async execute(client, interaction, prefix){
        try{
            const voicechannel = interaction.member.voice.channel
            const queue = client.distube.getQueue(voicechannel);

            //comprobaciones previas :o

            if (!queue){
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR)
                            .setDescription(`No hay música reproduciendose`)
                    ],
                    ephemeral: true
                })
            }
            if (!voicechannel){
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR)
                            .setDescription(`Tienes que estar en un canal de voz para ejecutar el comando 🤨`)
                    ],
                    ephemeral: true
                })
            }
           
            client.distube.pause(voicechannel);
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Pausar música')
                        .setThumbnail('https://i.imgur.com/kY0gh91.gif')
                        .setColor(process.env.COLOR)
                        .addFields({name: `Se pausó la música`, value:`🚦🛑`})
                ]
            })

        }catch(e){
            interaction.reply({content: `**Ha ocurrido un error al recargar el bot**\nMira la consola para mas detalle :P`, ephemeral: true});
            return console.log(e);
        }
    } 
       
}