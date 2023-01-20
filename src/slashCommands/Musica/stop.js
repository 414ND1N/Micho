const {SlashCommandBuilder, EmbedBuilder,} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Sirve para desconectar al bot de la sala de voz"),
    async execute(client, interaction, prefix){
        try{
            await interaction.deferReply()
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
           
            client.distube.stop(voicechannel);
            
            await interaction.deleteReply()

        }catch(e){
            interaction.reply({content: `**Ha ocurrido un error al recargar el bot**\nMira la consola para mas detalle :P`, ephemeral: true});
            return console.log(e);
        }
    } 
       
}