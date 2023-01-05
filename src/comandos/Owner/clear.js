const {EmbedBuilder} = require('discord.js');
module.exports = {
    DESCRIPTION: "Elimina los mensajes indicados del canal",
    ALIASES: ["limpiar"], 
    OWNER: true,
    async execute (client, message, args, prefix){

        const valor = parseInt(args[0]);

        if (!valor){
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setDescription(`❌ | **Error**\n\nDebes escribir al menos un numero de mensajes para borrar`)
                ]
            })
        };
    
        if (valor >= 100){
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setDescription(`❌ | **Máximo de 99 mensajes para borrar**`)
                ]
            })
        };

        message.channel.bulkDelete(valor + 1, true);

        const ClearCommandembed = new EmbedBuilder()
            .setTitle('🧹 __CLEAR__ 🧹')
            .setColor(process.env.COLOR)
            .setDescription(`Se han eliminado una cantidad de ${valor} de mensajes`)
            .setThumbnail("https://i.imgur.com/WHCwA6t.gif")

        message.channel.send({ embeds: [ClearCommandembed] })
            .then(msg => {setTimeout(() => msg.delete(), 10000)}).catch(console.log('Error csm con clear :p'));
    }   
} 