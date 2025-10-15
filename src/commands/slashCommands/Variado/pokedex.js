const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
// const { ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const buttonPagination = require('../../../utils/buttonPagination')
const axios = require('axios')

module.exports = {
    cooldown: 10,
    CMD: new SlashCommandBuilder()
        .setName("pokedex")
        .setDescription("Mostrar información de la pokedéx de tu pokemón preferido")
        .setDescriptionLocalizations({
            "en-US": "Show information from your favorite pokemon"
        })
        .addNumberOption(option =>
            option.setName("id")
                .setDescription('Pokemón que deseas buscar 🔍')
                .setDescriptionLocalizations({
                    "en-US": 'Pokemon you want to search 🔍'
                })
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(1025)
        ),
    async execute(interaction){

        try{
            //USO DE LA API pokeapi.co
            // const { client } = interaction

            const busqueda = interaction.options.getNumber("id")
            const url_api = `https://pokeapi.co/api/v2/pokemon/${busqueda}`
            let response = null

            //Verificar si existe el pokemón
            try {
                response = await axios.get(url_api)
            } catch (error) {
                return interaction.channel.send({
                    embeds: [
                            new EmbedBuilder()
                                .setColor(Number(process.env.COLOR_ERROR))
                            .setDescription(`No se encontró ningún pokemón con el id \`${busqueda}\``)
                    ],
                    ephemeral: true
                })
            }

            await interaction.channel.sendTyping()

            const pokemonData = response.data
            const pokemonName = pokemonData.name
            const pokemonHeight = (pokemonData.height / 3.281).toFixed(2)
            const pokemonWeight = pokemonData.weight
            const pokemonTypes = pokemonData.types.map(tipo => tipo.type.name)
            const defaultSpriteUrl = pokemonData.sprites.front_default
            const shinySpriteUrl = pokemonData.sprites.front_shiny
            const officialArtworDefaultSpriteUrl = pokemonData.sprites.other["official-artwork"].front_default
            const shinyArtworDefaultSpriteUrl = pokemonData.sprites.other["official-artwork"].front_shiny

            //Páginas
            var embeds = []

            embeds.push(
                new EmbedBuilder()
                    .setTitle(`Pokedéx | \`${busqueda}\` - \`${pokemonName}\``)
                    .setColor("Random")
                    .setImage(officialArtworDefaultSpriteUrl)
                    .setThumbnail(defaultSpriteUrl)
                    .addFields(
                        {name: `Peso`, value: `${pokemonWeight} kg`, inline: true},
                        {name: `Altura`, value: `${pokemonHeight} m`, inline: true},
                        {name: pokemonTypes.length > 1 ? 'Tipos' : 'Tipo', value: `${pokemonTypes.join(", ")}`},
                    )
                    .setTimestamp()
            ) //Agregamos el embed a la lista de embeds

            //Verificar existencia shiny a pokemon indicado
            if (shinyArtworDefaultSpriteUrl) {
                embeds.push(
                    new EmbedBuilder() //Creacion embed con informacion de la variante shiny
                        .setTitle(`Pokedéx | \`${busqueda}\` - \`${pokemonName} shiny\``)
                        .setColor("Random")
                        .setImage(shinyArtworDefaultSpriteUrl)
                        .setThumbnail(shinySpriteUrl)
                        .addFields(
                            {name: `Peso`, value: `${pokemonWeight} kg`, inline: true},
                            {name: `Altura`, value: `${pokemonHeight} m`, inline: true},
                            {name: pokemonTypes.length > 1 ? 'Tipos' : 'Tipo', value: `${pokemonTypes.join(", ")}`},
                        )
                        .setTimestamp()
                ) //Agregamos el embed a la lista de embeds
            }

            await buttonPagination(interaction, embeds, 90_000, false)
        } catch (error) {
            console.log("Error en pokedex :C")
            console.error(error)
            return interaction.editReply({
                embeds: [
                        new EmbedBuilder()
                            .setColor(Number(process.env.COLOR_ERROR))
                        .setDescription(`Ocurrió un error al mostrar la pokedéx`)
                ]
                , ephemeral: true
            })
        }
    }
}