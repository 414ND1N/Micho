const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Recarga los archivos del bot")
    .addStringOption(option =>
        option.setName("modulo")
        .setDescription("Módulo a recargar")
        .addChoices(
            {name: "Comandos", value:"comandos"},
            {name: "Comandos diagonales", value:"slash"},
            {name: "Eventos", value:"events"},
            {name: "Handlers", value:"handlers"},
        )
    ),
    async execute(client, interaction, prefix){
        let args = interaction.options.getString("modulo");
        let opcion = "Comandos, Eventos y Handlers";

        try{
            switch(args?.toLowerCase()){
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
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .addFields({name: `✅ ${opcion} recargados`, value:`> *Okay!*`})
                    .setColor(process.env.COLOR)
                ],
                ephemeral: true
            });
        }catch(e){
            interaction.reply({content: `**Ha ocurrido un error al recargar el bot**\nMira la consola para mas detalle :P`});
            console.log(e);
        }
    }
} 