const {EmbedBuilder} = require('discord.js')
module.exports = {
    ALIASES: ["pick"],
    DESCRIPTION: "Sirve para que toffu eliga entre distintas opciones",
    
    async execute(client, message, args, prefix){
        try{
            let argumento = args[0]?.toLowerCase()
            if (!argumento) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR)
                            .setDescription(`No hay opciones donde elegir, escribe algo 😊`)
                    ]
                })
            }
            
            let opciones = argumento.split(",")
            const randomIndex = Math.floor(Math.random() * opciones.length);
            const item = opciones[randomIndex];

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setDescription(`Elegí \`${item}\` 🧐`)
                ]
            })
        }catch(e){
            message.reply({content: `**Ha ocurrido un error en eleigr**\nMira la consola para mas detalle :P`});
            console.log(e);
            return;
        }
    }
} 