const {EmbedBuilder} = require('discord.js');
module.exports = {
    ALIASES: ["recargar"],
    DESCRIPTION: "Recarga los archivos del bot",
    OWNER: true,
    async execute(client, message, args, prefix){
        let opcion = "Comandos, Eventos y Handlers";

        try{

            switch(args[0]?.toLowerCase()){
                case "commands":
                case "comandos":{
                    opcion = "Comandos";
                    await client.loadCommands();
                    await client.loadSlashCommands();
                }
                    break;
                case "prefixcommands":
                case "prefix":{
                    opcion = "Comandos Prefix";
                    await client.loadCommands();
                }
                    break;
                case "slashcommands":
                case "slash":{
                    opcion = "Comandos Diagonales";
                    await client.loadSlashCommands();
                }
                    break;
                case "eventos":
                case "events":{
                    opcion = "Eventos";
                    await client.loadEvents();
                }
                    break;
                case "handlers":{
                    opcion = "Handlers";
                    await client.loadHandlers();
                }
                    break;
                default:{
                    await client.loadEvents();
                    await client.loadHandlers();
                    await client.loadSlashCommands();
                    await client.loadCommands();
                }   
                    break;
            }
            await message.reply({
                embeds: [
                    new EmbedBuilder()
                    .addFields({name: `✅ ${opcion} recargados`, value:`> *Okay!*`})
                    .setColor(process.env.COLOR)
                ]
            }).then(msg => {
                setTimeout(() => msg.delete(), 5000)
            }).catch(/*Error*/);

            console.log(`✅ ${opcion} recargados`.yellow);
            message.delete();
            
        }catch(e){
            message.reply({content: `**Ha ocurrido un error al recargar el bot**\nMira la consola para mas detalle :P`});
            console.log(e);
            return;
        }
    }
}