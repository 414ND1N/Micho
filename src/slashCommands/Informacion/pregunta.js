const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");
module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("pregunta")
        .setNameLocalizations({
            "en-US": "question"
        })
        .setDescription("Realiza una pregunta")
        .setDescriptionLocalizations({
            "en-US": "Ask a question"
        })
        .addSubcommand(subcommand => 
            subcommand.setName('grupo')
            .setDescription('Realiza una pregunta al grupo y podran reaccionar')
            .setDescriptionLocalizations({
                "en-US": "Ask a question to the group and they can react"
            })
            .addStringOption(option =>
                option.setName("pregunta")
                .setDescription('Pregunta que deseas realizar')
                .setDescriptionLocalizations({
                    "en-US": "Question you want to ask"
                })
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => 
            subcommand.setName(process.env.BOT_NAME.toLowerCase())
            .setDescription(`Realiza una pregunta a ${process.env.BOT_NAME} y te respondera con su sabiduria`)
            .setDescriptionLocalizations({
                "en-US": `Ask ${process.env.BOT_NAME} a question and he will answer you with his wisdom`
            })
            .addStringOption(option =>
                option.setName("pregunta")
                .setDescription('Pregunta que deseas realizar')
                .setDescriptionLocalizations({
                    "en-US": "Question you want to ask"
                })
                .setRequired(true)
            )
        )
    ,
    async execute(client, interaction){

        const SUB = interaction.options.getSubcommand();
        const PREGUNTA = interaction.options.getString("pregunta");
        switch(SUB){
            case "grupo":
                const embed_sug = new EmbedBuilder()
                    .setTitle(`Pregunta de \`${interaction.user?.username}\``)
                    .setDescription(`\`${PREGUNTA}\``)
                    .setColor(process.env.COLOR)
                    .setTimestamp()
                    .setThumbnail(`https://i.imgur.com/2BF8HEc.gif`);

                const mensaje = await interaction.reply({embeds: [embed_sug], fetchReply: true});
                
                mensaje.react(`👍`);
                mensaje.react(`👎`);
                mensaje.react(`🤨`);
                mensaje.react(`😴`);
                mensaje.react(`🏳️‍🌈`);

                return
                
            case process.env.BOT_NAME.toLowerCase():
                await interaction.deferReply(); // Defer para respuestas con un margen de tiempo de 15 minutos

                const configuration = new Configuration({
                    apiKey: process.env.OPENAI_API_KEY,
                });
                const openai = new OpenAIApi(configuration);

                let conversationLog = [{
                    role: 'system', content: process.env.OPENAI_BOT_CONTENT //Configuracion comportamiento bot
                }];

                //Enviar mensaje entrante del comando
                conversationLog.push({
                    role: 'user',
                    content: PREGUNTA,
                    name: interaction.user.username ?? undefined
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
                
                const respuesta = result?.data.choices[0].message;

                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`Pregunta de **${interaction.user?.username}**: \`${PREGUNTA}\``)
                            .setDescription(respuesta?.content.length <= 1024 ? respuesta?.content?? 'No tengo respuesta a tu pregunta 😓' : respuesta?.content.slice(0, 1020) + ' ...')
                            .setColor(process.env.COLOR)
                            .setFooter({ text: `Respuesta de ${process.env.BOT_NAME} con ChatGPT-3.5`})
                    ]
                });
        }
        
    }
} 