const { EmbedBuilder, ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const axios = require('axios');
module.exports = {
    CMD: new ContextMenuCommandBuilder()
        .setName("Accion")
        .setType(ApplicationCommandType.User),

    async execute(client, interaction, prefix) {

        const { username } = interaction.targetUser;
        const tipos = ['peppo', 'anime'];
        const randomIndexOpts = Math.floor(Math.random() * tipos.length);

        const query = 'hello' + tipos[randomIndexOpts];
        const url_api = `https://tenor.googleapis.com/v2/search?q=${new URLSearchParams({ query })}&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=15`;

        const response = await axios.get(url_api);
        const randomIndex = Math.floor(Math.random() * response.data.results.length);
        const gif_url = response.data.results[randomIndex]["media_formats"]["mediumgif"]["url"];

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`\`${interaction.user?.username} saludó a ${username}\``)
                    .setColor(process.env.COLOR)
                    .setImage(gif_url)
            ]
        })
    }
} 