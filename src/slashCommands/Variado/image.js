const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
        .setDescription("Genera una imagen con el texto que reciba.")
        .addStringOption(option =>
            option
                .setName("entrada")
                .setDescription("Lo que deseas que se genere en la imagen")
                .setRequired(true)
        ),

    async execute(client, interaction, prefix) {

        await interaction.deferReply(); // Defer si la respuesta tarda más de 3 segundos
        
        const wait = require('node:timers/promises').setTimeout;

        const prompt = interaction.options.getString("entrada");
        const query = new URLSearchParams({prompt});

        const img_url = `https://image.pollinations.ai/prompt/${query}`;
        await wait(5000); // 5 segundos de espera para que se genere la imagen

        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(process.env.COLOR)
                    .setDescription(`Se generó la imagen \`${prompt}\``)
                    .setImage(img_url)
            ]
        })
    }
}