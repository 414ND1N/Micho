const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const { COLOR, EIGHT_BALL_OPTIONS } = require('@/config')

module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("bola8")
        .setNameLocalizations({
            "en-US": "8ball"
        })
        .setDescription("Bola 8 te dará la respuesta a tu pregunta")
        .setDescriptionLocalizations({
            "en-US": "8ball will give you the answer to your question"
        })
        .addStringOption(option =>
            option.setName("pregunta")
                .setNameLocalizations({
                    "en-US": "question"
                })
                .setDescription('Pregunta que deseas que la bola te responda')
                .setDescriptionLocalizations({
                    "en-US": "Question you want the ball to answer"
                })
                .setRequired(true)
        ),
    async execute(interaction){
        
        let pregunta = interaction.options.getString("pregunta")

        const randomIndex = Math.floor(Math.random() * EIGHT_BALL_OPTIONS.length)
        const item = EIGHT_BALL_OPTIONS[randomIndex]
        
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${interaction.user?.username} pregunto: **${pregunta}**`)
                        .setColor(COLOR)
                    .setThumbnail(EIGHT_BALL)
                    .setDescription(`**Mi respuesta es:** \`${item}\``)
            ]
        })
    }
}