const {EmbedBuilder} = require('discord.js')
module.exports = {
    ALIASES: ["reproducir"],
    DESCRIPTION: "Sirve para reproducir una canción dada",
    async execute(client, message, args, prefix){
        //comprobaciones previas :o
        if (!args.length) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setDescription(`Tienes que especificar el nombre de una canción 🤨`)
                ]
            })
        }
        
        if (!message.member.voice?.channel){
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setDescription(`Tienes que estar en un canal de voz para ejecutar el comando 🤨`)
                ]
            })
        };

        client.distube.play(message.member.voice?.channel, args.join(" "),{
            member: message.member,
            textChannel: message.channel,
            message
        });
        
        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Reproducción música')
                    .setThumbnail('https://i.imgur.com/vMaawHJ.gif')
                    .setColor(process.env.COLOR)
                    .addFields({name: `Buscando \`${args}\` ...`, value:`> 🔎🧐`})
            ]
        })
    }  
}