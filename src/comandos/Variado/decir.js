const {EmbedBuilder} = require('discord.js')
module.exports = {
    ALIASES: ["say"],
    DESCRIPTION: "Sirve para que toffu diga el texto dado",
    
    async execute(client, message, args, prefix){
        try{
            let channel = message.channel
            let argumento = args[0] 
            if (!argumento) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setDescription(`No hay mensaje que pueda decir, escribe algo 😊`)
                    ],
                    ephemeral: true
                });
            };
            message.delete();
            let msg = args.join(' ');
            channel.send(msg)

        }catch(e){
            message.reply({content: `**Ha ocurrido un error al recargar el bot**\nMira la consola para mas detalle :P`});
            console.log(e);
            return;
        }
    }
} 