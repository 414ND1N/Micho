module.exports = {
    DESCRIPTION: "Sirve para saltar a la canción anterior en la lista de reproducción",
    async execute(client, message, args, prefix){
        //comprobaciones previas :o
        const queue = client.distube.getQueue(message);
        if (!queue) return message.reply(`No hay música reproduciendose`)
        if (!message.member.voice?.channel) return message.reply(`Tienes que estar en un canal de voz para ejecutar el comando 🤨`);
        //if (message.guild.me.voice?.channel && message.member.voice?.channel.id != message.guild.me.voice?.channel) return message.reply(`Tienes que estar en el mismo canal que yo para ejecutar el comando, duhh :p`);

        client.distube.previous(message);
        message.reply(`⏮ **Saltando a la canción anterior**`);
    } 
       
}