const {EmbedBuilder} = require('discord.js')
module.exports = {
    ALIASES: ["mezclar"],
    DESCRIPTION: "Sirve para mezclar las canciónes de la lista",
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

        client.distube.shuffle(message);
        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Mezcla lista música')
                    .setThumbnail('https://i.imgur.com/8L4WreH.gif')
                    .setColor(process.env.COLOR)
                    .addFields({name: `Se mezcló la lista de música`, value:`🎶 😎👍`})
            ]
        });
    } 
       
}