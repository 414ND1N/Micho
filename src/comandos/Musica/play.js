module.exports = {
    DESCRIPTION: "Sirve para reproducir una canción dada",
    async execute(client, message, args, prefix){
        //comprobaciones previas :o
        if (!args.length) return message.reply(`Tienes que especificar el nombre de una canción 🤨`);
        if (!message.member.voice?.channel) return message.reply(`Tienes que estar en un canal de voz para ejecutar el comando 🤨`);
        //if (message.guild.me.voice?.channel && message.member.voice?.channel.id != message.guild.me.voice?.channel) return message.reply(`Tienes que estar en el mismo canal que yo para ejecutar el comando, duhh :p`);

        client.distube.play(message.member.voice?.channel, args.join(" "),{
            member: message.member,
            textChannel: message.channel,
            message
        });
        message.reply(`🔎 **Buscando \`${args.join(" ")}\` ...**`);
    } 
       
}