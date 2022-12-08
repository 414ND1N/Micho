const {EmbedBuilder} = require('discord.js')
module.exports = {
    
    DESCRIPTION: "Sirve para que toffu diga el texto dado",
    
    async execute(client, message, args, prefix){
        try{
            message.delete();
            let argumento = args[0]
            if (!argumento) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR)
                            .setDescription(`No hay mensaje que pueda decir, escribe algo 😊`)
                    ],
                    ephemeral: true
                })
            }
            msg = args.join(' ');
            message.reply(msg)
            return;

        }catch(e){
            message.reply({content: `**Ha ocurrido un error al recargar el bot**\nMira la consola para mas detalle :P`});
            console.log(e);
            return;
        }
    }
} 