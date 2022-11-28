module.exports = {
    DESCRIPTION: "Sirve para ver  el ping del botsito",
    async execute(client, message, args, prefix){
        return message.reply(`\`Ping de ${client.ws.ping}ms 🧐\``)
    }
}
