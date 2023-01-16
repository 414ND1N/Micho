const {EmbedBuilder} = require('discord.js')
module.exports = {
    ALIASES: ["parar"],
    DESCRIPTION: "Sirve para desconectar al bot de la sala de voz",
    async execute(client, message, args, prefix){
        //comprobaciones previas :o
        const queue = client.distube.getQueue(message);
        if (!queue) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setDescription(`No hay música reproduciendose`)
                ]
            })
        };
        
        if (!message.member.voice?.channel){
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setDescription(`Tienes que estar en un canal de voz para ejecutar el comando 🤨`)
                ]
            })
        };

        client.distube.stop(message);
        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Finalización música')
                    .setColor(process.env.COLOR)
                    .addFields({name: `Saliendo del canal ...`, value:`> Hasta la próxima 😊`})
                    .setThumbnail('https://i.imgur.com/lIs9ZAg.gif')
            ]
        })
    } 
       
}