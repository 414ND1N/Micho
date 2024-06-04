const {EmbedBuilder} = require('discord.js')
module.exports = {
    DESCRIPTION: "Sirve para que la bola 8 de una respuesta a una pregunta",
    ALIASES: ["boladelasuerte","bola8"],
    async execute(client, message, args, prefix){
        try{
            let pregunta = args[0]
            if (!pregunta) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR_ERROR)
                            .setDescription(`No hay pregunta que responder, escribe algo 😊`)
                    ]
                })
            }
            msg = args.join(' ');

            const opciones = [
            "Es cierto",
            "Definitivamente",
            "Lo mas probable",
            "No tengo una respuesta para eso..",
            "No cuentes con ello",
            "Es muy dudoso",
            "Creeria que si",
            "Diria que no",
            "Los astros aun no se alinean",
            ]

            const randomIndex = Math.floor(Math.random() * opciones.length);
            const item = opciones[randomIndex];

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`${message.author.username} pregunto: **${msg}**`)
                        .setColor(process.env.COLOR)
                        .setThumbnail('https://i.imgur.com/q0C7GuE.png')
                        .setDescription(`**Mi respuesta es:** \`${item}\``)
                ]
            })
        }catch(e){
            message.reply({content: `**Ha ocurrido un error en 8ball**\nMira la consola para mas detalle :P`});
            console.log(e);
            return;
        }
    }
}