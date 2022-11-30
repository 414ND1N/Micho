const {EmbedBuilder} = require('discord.js')
module.exports = {
    DESCRIPTION: "Sirve para saltar a la canción anterior en la lista de reproducción",
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

        client.distube.previous(message);
        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOR)
                    .addFields({name: `**Saltando a la canción anterior**`, value:`> ⏮ ⏮ ⏮`})
            ]
        })
    } 
       
}