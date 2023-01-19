const {EmbedBuilder} = require('discord.js');
module.exports = {
    DESCRIPTION: "Elimina los mensajes indicados del canal",
    ALIASES: ["limpiar"], 
    OWNER: true,
    async execute (client, message, args, prefix){

        const valor = Number(args[0]);
        const user = message.mentions.users.first();
        const channelMessages = await message.channel.messages.fetch();

        if (!valor){ return console.log(`❌ | Error\nDebes escribir al menos un número de mensajes para borrar`.red)};
    
        if (valor > 100 || valor <=0){ return console.log(`❌ | Máximo de 99 mensajes y mínimo de 1 mensaje para borrar`.red)}

        if (user != undefined){
            let i = 0
            let messagesToDelete = []
            channelMessages.filter((mensaje) =>{
                if (mensaje.author.id == user.id && valor > i){
                    messagesToDelete.push(mensaje);
                    i++
                }
            });
            message.channel.bulkDelete(messagesToDelete, true).then((mensajes) => {
                console.log(`🧹 Se han eliminado una cantidad de ${mensajes.size} mensajes de ${user.username}`.blue);
            });
        }else{
            message.channel.bulkDelete(valor, true).then((mensajes) => {
                console.log(`🧹 Se han eliminado una cantidad de ${mensajes.size} mensajes`.blue);
            }); 
        }
    }   
} 