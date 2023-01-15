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
                        .setDescription(`❌ | **Error**\n\nDebes escribir al menos un número de mensajes para borrar`)
                ]
            })
        };
    
        if (valor > 100 || valor <=0){
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setDescription(`❌ | **Máximo de \`99\` mensajes y mínimo de \`1\` mensaje para borrar**`)
                ]
            })
        };

        await message.channel.bulkDelete(valor + 1, true).catch(err =>{ return });

        console.log(`🧹 CLEAR 🧹 | Se han eliminado una cantidad de ${valor} de mensajes`.red);
    }   
} 