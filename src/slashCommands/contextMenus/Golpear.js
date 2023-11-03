const { EmbedBuilder, ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const axios = require('axios');
module.exports = {
    CMD: new ContextMenuCommandBuilder()
        .setName("Accion")
        .setType(ApplicationCommandType.User),

    async execute(client, interaction){

        function get_random_option() {
            const tipos = ['zelda', 'pokemon', 'anime', 'adventure time', 'regular show'];
            const randomIndexOpts = Math.floor(Math.random() * tipos.length);
            return tipos[randomIndexOpts];
        }

        // Usuario que realiza la acción
        const AUTHOR = interaction.member?.nickname?? interaction.user.username; // Si no tiene apodo, se usa el nombre de usuario

        // Usuario al que se le hará la acción
        const USUARIO = interaction.targetUser; // Usuario al que se le hará la acción
        const MEMBER = interaction.guild.members.cache.get(USUARIO?.id); // Objeto de miembro del usuario
        const USERNAME = MEMBER?.nickname || USUARIO.username || 'todos'; // Apodo del usuario

        const query = `${get_random_option()} punch`; // Busqueda en Tenor
        const url_api = `https://tenor.googleapis.com/v2/search?q=${query}&key=${process.env.TENOR_API_KEY}&client_key=my_test_app&limit=8`;

        const response = await axios.get(url_api);
        const randomIndex = Math.floor(Math.random() * response.data.results.length);
        const gif_url = response.data.results[randomIndex]["media_formats"]["mediumgif"]["url"];

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`\`${AUTHOR} golpeó a ${USERNAME}.\``) // Si no se especifica usuario, se indica a todos
                    .setColor(process.env.COLOR)
                    .setImage(gif_url)
            ]
        });
    }
} 