const { SlashCommandBuilder,EmbedBuilder} = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Muestra el repositorio de mi código ☺"),

    async execute(client, interaction, prefix){
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOR)
                    .setDescription('Puedes encontrar mi código fuente en: https://github.com/414ND1N/Toffu.git')
            ]
        })
    }
} 