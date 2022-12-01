const {EmbedBuilder} = require('discord.js')
module.exports = {
    
    DESCRIPTION: "Sirve para elegir uno entre los datos dados",
    
    async execute(client, message, args, prefix){
        try{
            let argumento = args[0]?.toLowerCase()
            if (!argumento) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR)
                            .setDescription(`No hay opciones donde elegir, escribe algo 😊`)
                    ],
                    ephemeral: true
                })
            }
            
            let opciones = argumento.split(",")
            const randomIndex = Math.floor(Math.random() * opciones.length);
            const item = opciones[randomIndex];

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .addFields({name:`Elegí ${item}`, value:`> 🧐🍀`})
                ]
            })
        }catch(e){
            message.reply({content: `**Ha ocurrido un error al recargar el bot**\nMira la consola para mas detalle :P`});
            console.log(e);
            return;
        }
    }
} 