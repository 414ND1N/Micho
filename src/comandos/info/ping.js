module.exports = {
    DESCRIPTION: "Sirve para ver  el ping del botsito",
    PERMISSIONS : ["Administrator", "KickMembers", "BanMembers"],
    async execute(client, message, args, prefix){
        log('Comando de ping ejecutado');
        return message.reply(`\`Ping de ${client.ws.ping}ms 🧐\``);
    }
}
