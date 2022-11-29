module.exports = {
    DESCRIPTION: "Sirve para indicar el volumen de la canción en reproducción",
    async execute(client, message, args, prefix){
        //comprobaciones previas :o
        if (!args.length) return message.reply(`Tienes que especificar el nombre de una canción 🤨`);
        if (!message.member.voice?.channel) return message.reply(`Tienes que estar en un canal de voz para ejecutar el comando 🤨`);
        //if (message.guild.me.voice?.channel && message.member.voice?.channel.id != message.guild.me.voice?.channel) return message.reply(`Tienes que estar en el mismo canal que yo para ejecutar el comando, duhh :p`);

        client.distube.setVolume(message, Number(args[0]));
        message.reply(`Se cambió el volumen a ${Number(args[0])} %`);
    } 
       
}
