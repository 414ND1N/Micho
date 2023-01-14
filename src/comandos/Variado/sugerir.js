const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
module.exports = {
    ALIASES: ["sugerir","suggest","suggestion"],
    DESCRIPTION: "Sirve para dar una sugerencia para poder votar",
    
    async execute(client, message, args, prefix){
        try{
            let pregunta = args[0]
            if (!pregunta) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR)
                            .setDescription(`No hay sugerencia que votar, escribe algo 😊`)
                    ]
                })
            }
            msg = args.join(' ');

            const embed_sug = new EmbedBuilder()
                .setTitle(`Sugerencia de \`${message.author.username}\``)
                .setDescription(`\`${msg}\``)
                .setColor(process.env.COLOR)
                .setTimestamp()
                .setThumbnail(`https://i.imgur.com/rIPXKFQ.png`);

            const mensaje = await message.reply({embeds: [embed_sug], fetchReply: true});
        
            mensaje.react(`👍`);
            mensaje.react(`👎`);
            mensaje.react(`🏳️‍🌈`);

        }catch(e){
            message.reply({content: `**Ha ocurrido un error en sugerencia**\nMira la consola para mas detalle :P`});
            console.log(e);
            return;
        }
    }
} 