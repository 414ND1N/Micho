const {EmbedBuilder} = require('discord.js')
module.exports = {
    DESCRIPTION: "Sirve para saltar a una canción de la lista en reproducción",
    async execute(client, message, args, prefix){
        const queue = client.distube.getQueue(message);
        let num_cancion = Number(args[0])-1;
        //comprobaciones previas :o
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
        if (!args.length) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setDescription(`Tienes que especificar el número de canción 🤨`)
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

        client.distube.jump(message, parseInt(num_cancion));
        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOR)
                    .addFields({name: `**Se ha saltado a la canción número \`${Number(args)}\`**`, value:`> 🐱‍🏍 🎶🎵`})
            ]
        })
    }      
}