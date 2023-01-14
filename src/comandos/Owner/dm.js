module.exports = {
    ALIASES: ["msg"],
    DESCRIPTION: "Toffu envía un mensaje privado al usuario indicado",
    OWNER: true,
    async execute (client, message, args, prefix) {
        let channel = message.channel
        try{
            const userID = args[0]
            const mensaje = args.slice(1).join(" ");

            if(!userID) return message.channel.send("Debes colocar la ID o mencionar a alguien 😐");
            const user = message.mentions.users.first();
            
            if(!user) return message.reply("No se encontró destinario, vuelve a intentarlo");
            if(!mensaje) return message.reply("Debes poner un texto para mandar");
            
            user.send(mensaje);
            
            console.log(`Mensaje envíado a ${user.username} \n > ${mensaje}`);
            message.delete();
            
        }catch(e){
            channel.send({content: `**Ha ocurrido un error al recargar el bot**\nMira la consola para mas detalle :P`});
            console.log(e);
            return;
        }
    }
}                      