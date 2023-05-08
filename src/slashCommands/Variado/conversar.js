const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
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

        await interaction.deferReply();

        const configuration = new Configuration({
            organization: process.env.OPENAI_ORG,
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);

        let conversationLog = [{
            role: 'system', content: process.env.OPENAI_BOT_CONTENT //Ej: "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly"
        }];

        await interaction.channel.sendTyping();
        
        //MENSAJES PREVIOS
        let prevMessages = await interaction.channel.messages.fetch({ limit: 5 });
        prevMessages.reverse();

        prevMessages.forEach((msg) => {
            if (msg.author.id !== interaction.user.id) return;

            conversationLog.push({
                role: 'user',
                content: msg.content,
            });
        });
        

        //MENSAJE ENTRANTE
        const mensajeEntrante = interaction.options.getString("mensaje");
        conversationLog.push({
            role: 'user',
            content: mensajeEntrante,
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
            interaction.channel.send(result.data.choices[0].message)
        }
        return await interaction.deleteReply();
    }
} 