const {EmbedBuilder} = require('discord.js');
module.exports = {
    ALIASES: ["sugerir","suggest","suggestion"],
    DESCRIPTION: "Sirve para dar una sugerencia para poder votar",
    
    async execute(client, message, args, prefix){
        try{
            let pregunta = args[0]
            const channel = client.channels.cache.get('1074130218224197695');
            
            if (!pregunta) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR_ERROR)
                            .setDescription(`No hay sugerencia que votar, escribe algo 😊`)
                    ]
                })
            }
            let msg = args.join(' ');

            const mensaje = await channel.send({ embeds: [
                new EmbedBuilder()
                    .setTitle(`Sugerencia de \`${message.author.username}\``)
                    .setDescription(`\`${msg}\``)
                    .setColor(process.env.COLOR)
                    .setTimestamp()
                    .setThumbnail(`https://i.imgur.com/t6AR3RO.gif`)
            ], fetchReply: true });
            mensaje.react(`👍`);
            mensaje.react(`👎`);

            message.reply({ embeds: [
                new EmbedBuilder()
                    .setTitle(`Sugerencia realizada`)
                    .setDescription(`Se envió tu sugerencia al canal de \`sugerencias\``)
                    .setColor(process.env.COLOR)
                    .setTimestamp()
                    .setThumbnail(`https://i.imgur.com/X3E6BAy.gif`)
            ]}).then(msg => {
                setTimeout(() => msg.delete(), 5000)
            }).catch(/*Error*/);
            

        }catch(e){
            message.reply({content: `**Ha ocurrido un error en sugerencia**\nMira la consola para mas detalle :P`});
            console.log(e);
            return;
        }
    }
} 