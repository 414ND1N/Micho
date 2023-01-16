const {EmbedBuilder} = require('discord.js');
module.exports = {
    DESCRIPTION: "Elimina los mensajes indicados del canal",
    ALIASES: ["limpiar"], 
    OWNER: true,
    async execute (client, message, args, prefix){

        const valor = parseInt(args[0]);

        if (!valor){ return console.log(`❌ | Error\nDebes escribir al menos un número de mensajes para borrar`.red)};
    
        if (valor > 100 || valor <=0){ return console.log(`❌ | Máximo de 99 mensajes y mínimo de 1 mensaje para borrar`.red)}

        await message.channel.bulkDelete(valor + 1, true).catch(err =>{ return });

        console.log(`🧹 CLEAR 🧹 | Se han eliminado una cantidad de ${valor} de mensajes`.blue);
    }   
} 