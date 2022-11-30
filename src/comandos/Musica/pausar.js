const {EmbedBuilder} = require('discord.js')
module.exports = {
    name: "pause",
    DESCRIPTION: "Sirve para pausar la música en reproducción",
    async execute(client, message, args, prefix){
        //comprobaciones previas :o
        const queue = client.distube.getQueue(message);
        if (!queue) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setDescription(`No hay música reproduciendose`)
                ],
                ephemeral: true
            })
        };
        
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

        client.distube.pause(message);
        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOR)
                    .addFields({name: `**Se ha pausado la música**`, value:`> 🚦🛑`})
            ]
        })
    } 
       
}