const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai'); // npm i openai

const configuracion = new Configuration({
    apiKey: process.env.OPENAI_API_KEY // https://platform.openai.com/account/api-keys
})

const openai = new OpenAIApi(configuracion)

module.exports = {
    CMD: new SlashCommandBuilder()
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription('Genera una imagen con una IA desde la API de ChatGPT')
        .addStringOption((option) => 
            option.setName(`contenido`)
                .setDescription(`Imagen que quieras generar`)
                .setRequired(true)
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(client, interaction) {
        const prompt = interaction.options.getString("contenido")
        await interaction.deferReply();

        try {
            const res = await openai.createImage({
                prompt,
                n: 1,
                size: '1024x1024',
            })

            const embed = new EmbedBuilder()
                .setTitle('Imagen por OpenIA')
                .setColor(process.env.COLOR)
                .setTimestamp()
                .setFooter({ iconURL: interaction.user.avatarURL({ dynamic: true }), text: interaction.user.tag })
                .setDescription(`Entrada: \`\`\`${prompt}\`\`\``)
                .setImage(`${res.data.data[0].url}`)

            await interaction.editReply({ embeds: [embed] })
        } catch (e) {
            console.log(e.response)
            return await interaction.editReply({ content: `Solicitud fallida con el estado del código **${e.response.status}**`, ephemeral: true })
        }
    },
};