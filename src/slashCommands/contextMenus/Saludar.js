const { EmbedBuilder, ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const axios = require('axios');
module.exports = {
    CMD: new ContextMenuCommandBuilder()
        .setName("Accion")
        .setType(ApplicationCommandType.User),

    async execute(client, interaction, prefix) {

        function get_random_option() {
            const tipos = ['zelda', 'pokemon', 'anime', 'adventure time', 'regular show'];
            const randomIndexOpts = Math.floor(Math.random() * tipos.length);
            return tipos[randomIndexOpts];
        }

        const USUARIO = interaction.targetUser; // Usuario al que se le hará la acción
        const query = `${get_random_option()} saying hello`; // Busqueda en Tenor
        const url_api = `https://tenor.googleapis.com/v2/search?q=${query}&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=8`;

        const response = await axios.get(url_api);
        const randomIndex = Math.floor(Math.random() * response.data.results.length);
        const gif_url = response.data.results[randomIndex]["media_formats"]["mediumgif"]["url"];

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`\`${interaction.user.username} saludó a ${USUARIO?.username ?? 'todos'}.\``) // Si no se especifica usuario, se indica a todos
                    .setColor(process.env.COLOR)
                    .setImage(gif_url)
            ]
        });
    }
} 