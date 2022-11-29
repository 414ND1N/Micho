module.exports = {
    DESCRIPTION: "Sirve para reproducir DJPANAS",
    async execute(client, message, args, prefix){
        //comprobaciones previas :o
        args = 'https://www.youtube.com/playlist?list=PLtzt-E5Aq1-kGOPEbker6rjCQH6ZtKNz9'
        if (!message.member.voice?.channel) return message.reply(`Tienes que estar en un canal de voz para ejecutar el comando 🤨`);
        //if (message.guild.me.voice?.channel && message.member.voice?.channel.id != message.guild.me.voice?.channel) return message.reply(`Tienes que estar en el mismo canal que yo para ejecutar el comando, duhh :p`);

        client.distube.play(message.member.voice?.channel, args,{
            member: message.member,
            textChannel: message.channel,
            message
        });
        message.reply(`**Reproduciendo DJPANAS 😎**`);
    } 
       
}