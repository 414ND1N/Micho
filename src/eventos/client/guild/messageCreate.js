const { Configuration, OpenAIApi } = require("openai");

module.exports = async (client, message) => {
    if (!message.guild || !message.channel || message.author.bot) return;

    if (message.channel.id === process.env.ID_CANAL_CHATBOT) { startChatBot( message) } // ChatBot con GPT

    
    // COMANDOS PREFIX
    /*
    const args = message.content.slice(1).trim().split(/\s+/);
    const command = args.shift()?.toLowerCase();
    if(!message.content.startsWith(process.env.PREFIX)) return; // Si no empieza con el prefix, no es un comando

    const ARGS = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
    const CMD = ARGS?.shift()?.toLowerCase();

    const COMANDO = client.commands.get(CMD) || client.commands.find(c => c.ALIASES && c.ALIASES.includes(CMD));

    if(COMANDO){
        if (!message.guild.members.me.permissions.has("SendMessages")) return;

        if(COMANDO.OWNER) {
            const DUENOS = process.env.OWNER_IDS.split(" ");
            if (!DUENOS.includes(message.author.id)) return message.reply({content: `❌ **Solo los dueños del bot pueden ejecutar este comando! 🤨**\nFirma ${DUENOS.map(DUENO => `<@${DUENO}>`).join(", ")}`})
        }

        if(COMANDO.BOT_PERMISSIONS) {
            if (!message.guild.members.me.permissions.has(COMANDO.BOT_PERMISSIONS)) return message.reply({content: `❌ **Necesito los siguientes permisos para ejecutar este comando💀 :**\n${COMANDO.BOT_PERMISSIONS.map(PERMISO => `\`${PERMISO}\``).join(", ")}`})
        }

        if(COMANDO.PERMISSIONS) {
            if (!message.members.permissions.has(COMANDO.PERMISSIONS)) return message.reply({content: `❌ **Necesitas los siguientes permisos para ejecutar este comando💀 :**\n${COMANDO.PERMISSIONS.map(PERMISO => `\`${PERMISO}\``).join(", ")}`})
        }

        try{
            COMANDO.execute(client, message, ARGS, process.env.PREFIX);
        }catch (e){
            message.reply({content: `**Ha ocurrido un error al ejecutar el comando!**\n*Mira la consola para mas detalle :P*`});
            console.log(e)
            return;
        }

    }
    */

}

// Funcion chatbot
async function startChatBot( message) {
    //Chat con CHATGPT3.5
    if (message.channel.id !== process.env.ID_CANAL_CHATBOT) return; //Si el canal no es el de chatbot, no hacer nada

    if (message.content.startsWith(process.env.PREFIX_IGNORE_CHAT_API)) return; //Si inicia con "!" se ignora

    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    let conversationLog = [{
        role: 'system', content: process.env.OPENAI_BOT_CONTENT //
    }];

    await message.channel.sendTyping(); //Simular que el bot esta escribiendo

    //Añadir mensajes anteriores
    let prevMessages = await message.channel.messages.fetch({ limit: 6 });
    prevMessages.reverse();

    prevMessages.forEach((msg) => {
        if (message.content.startsWith(process.env.PREFIX_IGNORE_CHAT_API)) return; // Si el mensaje empieza con el prefijo de ignorar no hacer nada
        //if(msg.author.id !== client.user.id && message.author.bot) return; //Si el mensaje no es del mismo usuario o es bot no hacer nada
        if (message.author.bot) return; //Si el mensaje no es del mismo usuario o es bot no hacer nada

        conversationLog.push({
            role: 'assistant',
            content: msg.content,
            name: msg.author.username.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '')
        });

        //if (msg.author.id == message.author.id) {
        conversationLog.push({
            role: 'user',
            content: msg.content,
            name: message.author.username
                .replace(/\s+/g, '_')
                .replace(/[^\w\s]/gi, ''),
        });
        //};
    });

    //LLAMADA API
    try {
        const result = await openai
            .createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: conversationLog,
                // max_tokens: 256, // limit token usage
            })
            .catch((error) => {
                console.log(`Error de OPENAI:`);
                console.error(error)
            });
        
        message.reply(result.data.choices[0].message)
    } catch (error) {
        console.log(`Error de OPENAI:`);
        console.error(error)
    }

    

}
