const {ActivityType,EmbedBuilder} = require('discord.js');

module.exports = {
    ALIASES: ['presence'],
    DESCRIPTION: "Sirve para actualizar la presencia de Toffu",
    OWNER: true,
    async execute(client, message, args, prefix){
        //comprobaciones previas :o
        const sub = args[0].toLowerCase()
        if (!sub) { return console.log(`Debes colocar el tipo de presencia que quieres cambiar 😐`.red)}

        const tipo = args[1].toLowerCase()
        if (!tipo) { return console.log(`Debes colocar el tipo de estado/actividad que quieres cambiar 😐`.red)}

        switch(sub){
            case 'status':
            case 'estado':
                switch(tipo){
                    case 'idle':
                    case 'inactivo':
                    case 'offline':
                        client.user.setPresence({status: 'idle'});
                        break;
                    case 'dnd':
                    case 'donotdisturb':
                        client.user.setPresence({status: 'dnd'});
                        break;
                    case 'invisible':
                        client.user.setPresence({status: 'invisible'});
                        break;     
                    default:
                        client.user.setPresence({status: 'online'});
                        break;
                }
                break;
            case 'activity':
            case 'actividad':
                let actividad = args.slice(2).join(" ");
                switch(tipo){
                    case 'playing':
                    case 'jugando':
                        client.user.setActivity(actividad, {type: ActivityType.Playing});
                        break;
                    case 'streaming':
                    case 'estrimeando':
                        client.user.setActivity(actividad, {type: ActivityType.Streaming});
                        break;
                    case 'listening':
                    case 'escuchando':
                        client.user.setActivity(actividad, {type: ActivityType.Listening});
                        break;
                    case 'competing':
                    case 'compitiendo':
                        client.user.setActivity(actividad, {type: ActivityType.Competing});
                        break;     
                    default:
                        client.user.setActivity(actividad, {type: ActivityType.Watching});
                        break;
                }
        }

        await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Cambio de presencia de Toffu')
                    .setColor(process.env.COLOR)
                    .setDescription(`Se cambió ${sub} a \`${tipo}\`.`)
                    .setThumbnail("https://i.imgur.com/lIs9ZAg.gif")
            ]
        }).then(msg => {
            setTimeout(() => msg.delete(), 5000)
        }).catch(/*Error*/);
        message.delete();
    } 
}