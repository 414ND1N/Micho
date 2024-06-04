const {EmbedBuilder} = require('discord.js')
module.exports = {
    ALIASES: ["pausar"],
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

        client.distube.pause(message);
        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Pausar música')
                    .setThumbnail('https://i.imgur.com/kY0gh91.gif')
                    .setColor(process.env.COLOR)
                    .addFields({name: `Se pausó la música`, value:`🚦🛑`})
            ]
        });
    } 
       
}