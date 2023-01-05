const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Sirve para indicar el volumen de la canción en reproducción")
    .addIntegerOption(option =>
        option.setName("porcentaje")
        .setDescription("Porcentaje del volumen para la música reproduciéndose")
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(200)
    ),
    async execute(client, interaction, prefix){
        try{
            let args = interaction.options.getInteger("porcentaje");
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

            client.distube.setVolume(voicechannel, Number(args));
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .addFields({name:`Se cambió el volumen a ${Number(args)} %`, value:`> 🔈🔉 🔊`})
                ]
            })
            
        }catch(e){
            interaction.reply({content: `**Ha ocurrido un error al recargar el bot**\nMira la consola para mas detalle :P`, ephemeral: true});
            return console.log(e);
        }
    } 
       
}

