const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const axios = require('axios');
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Descubre sobre anime")
    .addSubcommand(subcommand =>
        subcommand.setName('informacion')
            .setDescription('Información de un anime')
            .addStringOption(option =>
                option.setName('nombre')
                    .setDescription('Nombre del anime a buscar')
                    .setRequired(true)
            )
    ),

    async execute(client, interaction){

        await interaction.deferReply(); // Defer para respuestas de más de 3 segundos

        //constantes
        const SUB = interaction.options.getSubcommand();

        switch(SUB){

            case 'informacion':{
                
                const nombreAnime = interaction.options.getString('nombre');
                const url_api = `https://api.jikan.moe/v4/anime?q=${nombreAnime}&sfw`;
                const response = await axios.get(url_api);

                if(response.data.data.length == 0){ // Si no se encuentra ningún anime con el nombre, se envía un mensaje de error
                    return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(process.env.COLOR_ERROR)
                            .setDescription(`No se encontró ningún anime con el nombre\n \`${nombreAnime}\``)
                            .setThumbnail('https://i.imgur.com/rIPXKFQ.png')
                        ]
                    })
                }
                const title = response.data.data[0].title;
                const title_japanese = response.data.data[0].title_japanese;
                const url_anime = response.data.data[0].url;
                const rank = response.data.data[0].rank;
                const episodes = response.data.data[0].episodes;
                const year = response.data.data[0].year;
                const status = response.data.data[0].status;
                const source = response.data.data[0].source;
                const rating = response.data.data[0].rating;
                const synopsis = response.data.data[0].synopsis;
                const synopsisFormated = synopsis?.length <= 1000 ? synopsis : synopsis.slice(0, 1000) + ' ...'; // Si la sinopsis es mayor a 1024 caracteres, se corta y se agrega '...'
                const genres = response.data.data[0].genres.map(genre => genre.name).join(', ');
                const themes = response.data.data[0].themes.map(theme => theme.name).join(', ');
                const score = response.data.data[0].score;
                const scored_by = response.data.data[0].scored_by;
                const image = response.data.data[0].images.webp.image_url;

                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Anime | \`${title} - ${title_japanese}\` `)
                        .setThumbnail(image)
                        .addFields(
                            { name: `Top AnimeList`, value: `${rank}`, inline: true},
                            { name: `Episodios`, value: `${episodes}`, inline: true},
                            { name: `Año salida`, value: `${year}`, inline: true },
                            { name: `Estado`, value: `${status}`, inline: true},
                            { name: `Fuente`, value: `${source}`, inline: true},
                            { name: `Rating`, value: `${rating}`, inline: true},
                            { name: `Temas`, value: `${themes}`, inline: true },
                            { name: `Generos`, value: `${genres}`, inline: true },
                            { name: `Sinopsis`, value: `${synopsisFormated}`},
                        )
                        .setURL(url_anime)
                        .setFooter({ text:`Puntuación ${score}/10 por ${scored_by} usuarios`})
                        .setColor(process.env.COLOR)
                    ]
                })
            }
            default:
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR_ERROR)
                            .setTitle(`Subcomando no encontrado`)
                    ]
                });
        }


    }
}