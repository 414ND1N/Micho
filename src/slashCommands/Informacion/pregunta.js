const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Realiza una pregunta")
    .addSubcommand(subcommand => 
        subcommand.setName('grupo')
        .setDescription('Realiza una pregunta al grupo y podran reaccionar')
        .addStringOption(option =>
            option.setName("pregunta")
              .setDescription('Pregunta que deseas realizar')
              .setRequired(true)
        )
    )
    .addSubcommand(subcommand => 
        subcommand.setName('toffu')
        .setDescription('Realiza una pregunta a Toffu y te respondera con su sabiduria')
        .addStringOption(option =>
            option.setName("pregunta")
              .setDescription('Pregunta que deseas realizar')
              .setRequired(true)
        )
    )
    ,
    async execute(client, interaction, prefix){

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

                break;
            case "toffu":
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
                            .setDescription(respuesta?.content.length <= 4096 ? respuesta?.content?? 'No tengo respuesta a tu pregunta 😓' : respuesta?.content.slice(0, 4093) + '...')
                            .setColor(process.env.COLOR)
                            .setFooter({ text: 'Respuesta de Toffu con ChatGPT-3.5'})
                    ]
                })
            
                break;
        }
        
    }
} 