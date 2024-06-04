const {EmbedBuilder} = require('discord.js')
module.exports = {
    ALIASES: ["saltar"],
    DESCRIPTION: "Sirve para saltar a una canción de la lista en reproducción",
    async execute(client, message, args, prefix){
        
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

        if (!args.length) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setDescription(`Tienes que especificar el número de canción 🤨`)
                ]
            })
        }
        let num_cancion = Number(args[0])-1;

        if (!message.member.voice?.channel){
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setDescription(`Tienes que estar en un canal de voz para ejecutar el comando 🤨`)
                ]
            })
        };
        if (num_cancion < 1) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setDescription(`No se puede saltar a la canción en reproducción`)
                ]
            })
        };
        
        if (num_cancion > (queue.songs.length)-1) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setDescription(`La lista unicamente cuenta con \`${queue.songs.length}\` canciones`)
                ]
            })
        };
        client.distube.jump(message, num_cancion);
        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Salto en lista de música')
                    .setThumbnail('https://i.imgur.com/bDO4VTw.gif')
                    .setColor(process.env.COLOR)
                    .addFields({name: `Se saltó a la canción número \`${Number(args)}\``, value:`🐱‍🏍 🎶🎵`})
            ]
        });
    }      
}