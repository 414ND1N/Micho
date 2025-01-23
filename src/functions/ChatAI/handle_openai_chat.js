const Channels = require('../../schemas/Channels')
const OpenAI = require('openai');

module.exports = async (message) => {
    if (message.author.bot) return //Si el mensaje es de un bot no hacer nada

    //Chat con DeepSeek

    // Buscar el canal en la bd con el guildID y el nombre
    const CHANNEL_DATA = await Channels.findOne({ GuildID: message.guild.id, Name: "ChattingWBot" })
    if (!CHANNEL_DATA) return

    if (message.content.startsWith("!!")) return

    const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: process.env.OPENAI_API_KEY
    });

    let conversationLog = [{
        role: 'system', content: process.env.OPENAI_BOT_BEHAVIOR //
    }];

    //Añadir mensajes anteriores
    let prevMessages = await message.channel.messages.fetch({ limit: 6 });
    prevMessages.reverse();

    prevMessages.forEach((msgi) => {
        if (message.content.startsWith("!!")) return; // Si el mensaje empieza con el prefijo de ignorar no hacer nada
        if (message.author.bot) return; //Si el es bot no hacer nada

        if (msgi.author.id !== message.client.user.id && message.author.bot) return; //Si el mensaje no es del mismo usuario o es bot no hacer nada

        if (msgi.author.id === message.client.user.id) { //Si el mensaje es del bot
            conversationLog.push({
                role: 'assistant',
                content: msgi.content,
                name: msgi.author.username.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '')
            });
        };
        if (msgi.author.id == message.author.id) {
            conversationLog.push({
                role: 'user',
                content: msgi.content,
                name: message.author.username
                    .replace(/\s+/g, '_')
                    .replace(/[^\w\s]/gi, ''),
            });
        };
    });

    await message.channel.sendTyping(); //Simular que el bot esta escribiendo

    //LLAMADA API
    const result = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: conversationLog,
        // max_tokens: 256, // limit token usage
    })
        .catch((error) => {
            console.log(`OPENAI ERR:`.red);
            console.error(error)
            return message.reply("Lo siento, no puedo responder en este momento")
        });

    message.reply(result.choices[0].message.content)
}