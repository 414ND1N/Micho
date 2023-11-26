const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const axios = require('axios');

module.exports = {
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
                .setMaxValue(1010)
        ),
    async execute(client, interaction){

        //USO DE LA API pokeapi.co

        await interaction.deferReply()

        const busqueda = interaction.options.getNumber("id")
        const url_api = `https://pokeapi.co/api/v2/pokemon/${busqueda}`
        let response = null

        //Verificar si existe el pokemón
        try {
            response = await axios.get(url_api)
        } catch (error) {
            interaction.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setDescription(`No se encontró ningún pokemón con el id \`${busqueda}\``)
                ],
                ephemeral: true
            })
            await interaction.deleteReply()
        }

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
        var embeds_pokedex = []

        const EmbedDefault = new EmbedBuilder()
            .setTitle(`Pokedéx | \`${busqueda}\` - \`${pokemonName}\``)
            .setColor(process.env.COLOR)
            .setImage(officialArtworDefaultSpriteUrl)
            .setThumbnail(defaultSpriteUrl)
            .addFields(
                {name: `Peso`, value: `${pokemonWeight} kg`, inline: true},
                {name: `Altura`, value: `${pokemonHeight} m`, inline: true},
                {name: `Tipos`, value: `${pokemonTypes.join(", ")}`},
            )
            .setTimestamp()

        await embeds_pokedex.push(EmbedDefault) //Agregamos el embed a la lista de embeds

        //Verificar existencia shiny a pokemon indicado
        if (shinyArtworDefaultSpriteUrl) {

            const EmbedShiny = new EmbedBuilder() //Creacion embed con informacion de la variante shiny
                .setTitle(`Pokedéx | \`${busqueda}\` - \`${pokemonName} shiny\``)
                .setColor(process.env.COLOR)
                .setImage(shinyArtworDefaultSpriteUrl)
                .setThumbnail(shinySpriteUrl)
                .addFields(
                    {name: `Peso`, value: `${pokemonWeight} kg`, inline: true},
                    {name: `Altura`, value: `${pokemonHeight} m`, inline: true},
                    {name: `Tipos`, value: `${pokemonTypes.join(", ")}`},
                )
                .setTimestamp()

            await embeds_pokedex.push(EmbedShiny) //Agregamos el embed a la lista de embeds
        }

        return paginacion()

        async function paginacion(){
            let row = null

            //Creacion boton salir para el menú
            const btn_salir =  new ButtonBuilder()
                .setCustomId('exit')
                .setLabel('❌ Salir')
                .setStyle(ButtonStyle.Danger)

            if (embeds_pokedex.length === 1) { //Si solo hay 1 embed enviamos el mensaje sin botones de navegacion
                row = new ActionRowBuilder().addComponents(btn_salir) //Agregamos el boton de salir
            } else {  //Si el numero de embeds es mayor a 1 ponemos los botones de paginacion
                const btn_normal =  new ButtonBuilder()
                    .setCustomId('normal')
                    .setStyle(ButtonStyle.Success)
                    .setLabel('Normal')
                const btn_shiny =  new ButtonBuilder()
                    .setCustomId('shiny')
                    .setStyle(ButtonStyle.Primary)
                    .setLabel('Shiny')
                row = new ActionRowBuilder().addComponents(btn_normal, btn_shiny, btn_salir) //Agregamos los botones de navegacion
            }

            let embedpaginas = await interaction.channel.send({
                embeds: [embeds_pokedex[0]],
                components: [row]
            }).catch(() => {})

            //Creación collector y se filtra que el usuario que de click sea la misma que ha puesto el comando, y el autor del mensaje sea el cliente (el bot)
            const collector = embedpaginas.createMessageComponentCollector({filter: i => i?.isButton() && i?.user && i?.user.id == interaction.user.id && i?.message.author.id  == client.user.id, time: 90e3})

            collector.on("collect", async action => {
                switch (action?.customId) {
                    case 'shiny':{
                        collector.resetTimer()
                        await embedpaginas.edit({embeds: [embeds_pokedex[1]], components: [embedpaginas.components[0]]}).catch(() => {})
                        await action?.deferUpdate()
                        break
                    }
                    case 'exit':{
                        collector.stop()
                        embedpaginas.edit({content:`( ͡° ͜ʖ ͡°)`, components:[]}).catch(() => {})
                        embedpaginas.suppressEmbeds(true)
                        break
                    }
                    default:{// Si no es ninguno de los botones de navegacion, se muestra el pokemon normal
                        collector.resetTimer()
                        await embedpaginas.edit({embeds: [embeds_pokedex[0]], components: [embedpaginas.components[0]]}).catch(() => {})
                        await action?.deferUpdate()
                    }
                }
            })

            collector.on("end", async () => {
                //se actualiza el mensaje y se elimina la interacción
                embed_help.edit({content: "", embeds:[
                    new EmbedBuilder()
                        .setColor(process.env.COLOR)
                        .setThumbnail("https://i.imgur.com/V6b6bnc.gif")
                ], components:[], ephemeral: true}).catch(() => {})
                await interaction.deleteReply()   
            })
        }
    }
}