const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js')

module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("recargar")
        .setNameLocalizations({ "en-US": "reload" })
        .setDescription("Recarga los archivos del bot")
        .setDescriptionLocalizations({
            "en-US": "Reload bot files"
        })
        .addStringOption(option =>
            option.setName("modulo")
                .setNameLocalizations({ "en-US": "module" })
                .setDescription("Módulo a recargar")
                .setDescriptionLocalizations({ "en-US": "Module to reload" })
                .addChoices(
                    {name: "Comandos", value:"commands"},
                    {name: "Eventos", value:"events"},
                    {name: "Handlers", value:"handlers"},
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(client, interaction){
        let args = interaction.options.getString("modulo")
        let opcion = "Comandos, Eventos y Handlers"

        await interaction.deferReply() // Defer para respuestas de más de 3 segundos

        try{
            switch(args?.toLowerCase()){
                case "commands":{
                    opcion = "Comandos"
                    await client.loadSlashCommands()
                }
                    break
                case "events":{
                    opcion = "Eventos"
                    await client.loadEvents()
                }
                    break
                case "handlers":{
                    opcion = "Handlers"
                    await client.loadHandlers()
                }
                    break
                default:{
                    await client.loadEvents()
                    await client.loadHandlers()
                    await client.loadSlashCommands()
                }   
                    break
            }
            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .addFields({name: `✅ ${opcion} recargados`, value:`> *Okay!*`})
                    .setColor(process.env.COLOR)
                ],
                ephemeral: true
            })
            console.log(`✅ ${opcion} recargados\n`.yellow)
        }catch(e){
            interaction.editReply({
                content: `**Ha ocurrido un error al recargar el bot**\nMira la consola para mas detalle :P`,
                ephemeral: true
            })
            console.log(e)
        }
    }
} 