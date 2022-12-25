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
                }
                    break;
                case "slashCommands":
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
            console.log(`✅ ${opcion} recargados`);
            message.delete();
            
        }catch(e){
            message.reply({content: `**Ha ocurrido un error al recargar el bot**\nMira la consola para mas detalle :P`});
            console.log(e);
            return;
        }
    }
}