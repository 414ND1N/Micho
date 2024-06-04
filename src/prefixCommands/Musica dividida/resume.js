const {EmbedBuilder} = require('discord.js')
module.exports = {
    ALIASES: ["resumir"],
    DESCRIPTION: "Sirve para resumir la reproducción de la música",
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

        client.distube.resume(message);
        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Resumen música')
                    .setThumbnail('https://i.imgur.com/Zqg98ma.gif')
                    .setColor(process.env.COLOR)
                    .addFields({name: `Se resumió la reproducción`, value:`🐱‍🏍 🎶🎵`})
                ]
        });
    } 
       
}