const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");

module.exports = {
    CMD: new SlashCommandBuilder()
        .setDescription("Conversa con Toffu a traves de su inteligencia artificial")
        .addStringOption(option =>
            option.setName("mensaje")
                .setDescription('Mensaje que deseas realizar')
                .setRequired(true)
        ),
    async execute(client, interaction, prefix) {
        
        const channel = client.channels.cache.get(process.env.ID_CANAL_CHATBOT); //ID del canal de chatbot
        const channel_pruebas = client.channels.cache.get(process.env.ID_CANAL_PRUEBAS); //ID del canal de pruebas

        //Si el canal no es el de chatbot ó el canal de pruebas se envia un mensaje de error
        if (interaction.channel != channel && interaction.channel != channel_pruebas) {
            return interaction.reply({ 
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR_ERROR)
                        .setDescription(`Utiliza el comando en el canal ${channel}`)
                ],
                ephemeral: true
            })
        }

        await interaction.deferReply();

        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);

        let conversationLog = [{
            role: 'system', content: process.env.OPENAI_BOT_CONTENT //Ej: "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly"
        }];

        await interaction.channel.sendTyping();
        
        //MENSAJES PREVIOS
        let prevMessages = await interaction.channel.messages.fetch({ limit: 8 });
        prevMessages.reverse();

        //Leer los mensajes anteriores
        prevMessages.forEach((msg) => {

            let indexUsername = msg.content.indexOf(":"); // Busqueda del username en el mensaje enviado por el bot

            if (indexUsername != -1){ //Si existe un username
                let userName = msg.content.substring(1, indexUsername);//Obtener el nombre del usuario del mensaje

                //Verificar que el mensaje sea del bot y el mensaje recibido sea del usuario que hablo
                if (userName == interaction.user.username && msg.author.id == process.env.BOT_ID ) {
                    conversationLog.push({
                        role: 'user',
                        content: msg.content.substring(indexUsername+1, msg.content.length-1), //Eliminar el nombre del usuario y las comillas simples del formato
                        name: userName
                            .replace(/\s+/g, '_')
                            .replace(/[^\w\s]/gi, ''),
                    });
                }

            }
        });
        
        //Enviar mensaje entrante del comando
        const mensajeEntrante = interaction.options.getString("mensaje");
        conversationLog.push({
            role: 'user',
            content: mensajeEntrante,
            name: interaction.user.username
        });

        //LLAMADA API
        const result = await openai
            .createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: conversationLog,
                // max_tokens: 256, // limit token usage
            })
            .catch((error) => {
                console.log(`OPENAI ERR`);
                console.error(error)
            });

        if(result){
            interaction.channel.send(`\`${interaction.user.username}: ${mensajeEntrante}\``)
            interaction.channel.send(result.data.choices[0].message)
        }
        return await interaction.deleteReply();
    }
} 