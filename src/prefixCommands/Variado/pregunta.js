const {EmbedBuilder} = require('discord.js');
module.exports = {
    ALIASES: ["ask","preguntar"],
    DESCRIPTION: "Sirve para dar un mensaje de pregunta",
    
    async execute(client, message, args, prefix){
        try{
            let pregunta = args[0]
            if (!pregunta) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR_ERROR)
                            .setDescription(`No hay pregunta que responder, escribe algo 😊`)
                    ]
                })
            }
            msg = args.join(' ');

            const embed_sug = new EmbedBuilder()
                .setTitle(`Pregunta de \`${message.author.username}\``)
                .setDescription(`\`${msg}\``)
                .setColor(process.env.COLOR)
                .setTimestamp()
                .setThumbnail(`https://i.imgur.com/2BF8HEc.gif`);

            const mensaje = await message.reply({embeds: [embed_sug], fetchReply: true});
        
            mensaje.react(`👍`);
            mensaje.react(`👎`);
            mensaje.react(`🤨`);
            mensaje.react(`😴`);
            mensaje.react(`🏳️‍🌈`);

        }catch(e){
            message.reply({content: `**Ha ocurrido un error en sugerencia**\nMira la consola para mas detalle :P`});
            console.log(e);
            return;
        }
    }
} 