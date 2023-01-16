module.exports = {
    ALIASES: ["msg"],
    DESCRIPTION: "Toffu envía un mensaje privado al usuario indicado",
    OWNER: true,
    async execute (client, message, args, prefix) {
        let channel = message.channel
        try{
            const userID = args[0]
            const mensaje = args.slice(1).join(" ");

            if(!userID) { return console.log("Debes colocar la ID o mencionar a alguien 😐".red)}
            const user = message.mentions.users.first();
            
            if(!user) { return console.log("No se encontró destinario, vuelve a intentarlo".red)}
            if(!mensaje) { return console.log("Debes poner un texto para mandar".red)}
            
            user.send(mensaje);
            
            console.log(`Mensaje envíado a ${user.username} \n > ${mensaje}`.blue);
            message.delete();
            
        }catch(e){
            channel.send({content: `**Ha ocurrido un error al recargar el bot**\nMira la consola para mas detalle :P`});
            console.log(e);
            return;
        }
    }
}                      