const { EmbedBuilder} = require('discord.js')
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
            await message.reply({ embeds: [
                new EmbedBuilder()
                    .setTitle('🧹 __CLEAR__ 🧹')
                    .setColor(process.env.COLOR)
                    .setDescription(`Se han eliminado mensajes de \`${user.username}\``)
                    .setThumbnail("https://i.imgur.com/7bj9r36.gif")
            ]}).
            then(msg => {
                setTimeout(() => msg.delete(), 5000)
            }).catch(/*Error*/);
        }else{
            message.channel.bulkDelete(valor, true).then((mensajes) => {
                console.log(`🧹 Se han eliminado una cantidad de ${mensajes.size-1} mensajes`.blue);
            });
            await message.reply({ embeds: [
                new EmbedBuilder()
                    .setTitle('🧹 __CLEAR__ 🧹')
                    .setColor(process.env.COLOR)
                    .setDescription(`Se han eliminado mensajes`)
                    .setThumbnail("https://i.imgur.com/7bj9r36.gif")
            ]}).
            then(msg => {
                setTimeout(() => msg.delete(), 5000)
            }).catch(/*Error*/);
        }
    }   
} 