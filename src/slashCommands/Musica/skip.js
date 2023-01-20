const {SlashCommandBuilder, EmbedBuilder,} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Sirve para saltar a la siguiente canción en la lista de reproducción"),
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
           
            client.distube.skip(voicechannel);
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Siguiente música')
                        .setThumbnail('https://i.imgur.com/9fBJ0s7.gif')
                        .setColor(process.env.COLOR)
                        .addFields({name: `Se saltó a la siguiente música`, value:`⏭ ⏭ ⏭ `})
                ]
            })

        }catch(e){
            interaction.reply({content: `**Ha ocurrido un error al recargar el bot**\nMira la consola para mas detalle :P`, ephemeral: true});
            return console.log(e);
        }
    } 
       
}