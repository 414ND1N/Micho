const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Sirve para indicar el volumen de la canción en reproducción")
    .addStringOption(option =>
        option.setName("volumen")
        .setDescription("Volumen para la reproducción")
        .setRequired(true)
    ),
    async execute(client, interaction, prefix){
        try{
            let args = interaction.options.getString("volumen");
            const voicechannel = interaction.member.voice.channel

            //comprobaciones previas :o

            if (args == null) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR)
                            .setDescription(`Tienes que especificar el volumen 🤨`)
                    ],
                    ephemeral: true
                })
            }
            if (!args.length) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR)
                            .setDescription(`Tienes que especificar el volumen 🤨`)
                    ],
                    ephemeral: true
                })
            }
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
            interaction.reply({content: `**Ha ocurrido un error al recargar el bot**\nMira la consola para mas detalle :P`});
            console.log(e);
            return;
        }
    } 
       
}

