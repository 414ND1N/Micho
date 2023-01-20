const {EmbedBuilder} = require('discord.js')
module.exports = {
    ALIASES: ["siguiente"],
    DESCRIPTION: "Sirve para saltar a la siguiente canción en la lista de reproducción",
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

        client.distube.skip(message);
        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Siguiente música')
                    .setThumbnail('https://i.imgur.com/9fBJ0s7.gif')
                    .setColor(process.env.COLOR)
                    .addFields({name: `Se saltó a la siguiente música`, value:`⏭ ⏭ ⏭ `})
            ]
        })
    } 
       
}