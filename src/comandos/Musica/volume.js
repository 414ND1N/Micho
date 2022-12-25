const {EmbedBuilder} = require('discord.js')
module.exports = {
    ALIASES: ["volumen"],
    DESCRIPTION: "Sirve para indicar el volumen de la canción en reproducción",
    async execute(client, message, args, prefix){
        //comprobaciones previas :o
        if (!args.length) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setDescription(`Tienes que especificar el volumen 🤨`)
                ],
                ephemeral: true
            })
        }
        
        if (!message.member.voice?.channel){
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setDescription(`Tienes que estar en un canal de voz para ejecutar el comando 🤨`)
                ],
                ephemeral: true
            })
        };

        client.distube.setVolume(message, Number(args[0]));
        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOR)
                    .addFields({name:`Se cambió el volumen a ${Number(args[0])} %`, value:`> 🔈🔉 🔊`})
            ]
        })
    }      
}
