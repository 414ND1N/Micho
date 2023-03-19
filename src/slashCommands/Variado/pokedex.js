const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const axios = require('axios');
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Sirve para mostrar información de un pokemón según su id")
    .addNumberOption(option =>
        option.setName("id")
        .setDescription('Gif que deseas buscar 🔍')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(1010)
    ),
    async execute(client, interaction, prefix){

        await interaction.deferReply();

        let busqueda = interaction.options.getNumber("id");

        let url_api = `https://pokeapi.co/api/v2/pokemon/${busqueda}`;
        
        const response = await axios.get(url_api);
        const pokemonData = response.data;
        const pokemonName = pokemonData.name;
        const pokemonHeight = (pokemonData.height / 3.281).toFixed(2);
        const pokemonWeight = pokemonData.weight;
        const pokemonTypes = pokemonData.types.map(tipo => tipo.type.name);
        const pokemonType = pokemonTypes.join(", ");
        const defaultSpriteUrl = pokemonData.sprites.front_default;
        const shinySpriteUrl = pokemonData.sprites.front_shiny;
        const officialArtworDefaultSpriteUrl = pokemonData.sprites.other["official-artwork"].front_default
        const shinyArtworDefaultSpriteUrl = pokemonData.sprites.other["official-artwork"].front_shiny

        //Páginas
        var embeds = [];

        const EmbedDefault = new EmbedBuilder()
            .setTitle(`Pokedéx | \`${pokemonName}\``)
            .setColor(process.env.COLOR)
            .setDescription(`${interaction.user?.username} buscó al pokemón No. \`${busqueda}\``)
            .setImage(officialArtworDefaultSpriteUrl)
            .setThumbnail(defaultSpriteUrl)
            .addFields(
                {name: `Tamaño`, value: ` Peso: \`${pokemonWeight} kg\`,  Altura: \`${pokemonHeight} m\``},
                {name: `Tipos`, value: `${pokemonType}`},
            )
            .setTimestamp();

        const EmbedShiny = new EmbedBuilder()
            .setTitle(`Pokedéx | \`${pokemonName} shiny\``)
            .setColor(process.env.COLOR)
            .setDescription(`${interaction.user?.username} buscó a al pokemón No.\`${busqueda}\``)
            .setImage(shinyArtworDefaultSpriteUrl)
            .setThumbnail(shinySpriteUrl)
            .addFields(
                {name: `Tamaño`, value: ` Peso: \`${pokemonWeight} kg\`,  Altura: \`${pokemonHeight} m\``},
                {name: `Tipos`, value: `${pokemonType}`},
            )
            .setTimestamp();
        
        await embeds.push(EmbedDefault);

        //Si no hay imagen shiny no se el segundo embed
        if (shinyArtworDefaultSpriteUrl) {
            await embeds.push(EmbedShiny);
        }

        return paginacion();

        async function paginacion(){
            let pag_actual = 0
            let embedpaginas = null;
            let row = null;

            //Creacion boton salir para el menú
            let btn_salir =  new ButtonBuilder()
                .setCustomId('exit')
                .setLabel('❌ Salir')
                .setStyle(ButtonStyle.Danger);

            //Si solo hay 1 embed enviamos el mensaje sin botones de navegacion
            if (embeds.length === 1) {

                row = new ActionRowBuilder().addComponents(btn_salir);

                embedpaginas = await interaction.channel.send({
                    embeds: [embeds[0]],
                    components: [row]
                }).catch(() => {});
            
            //Si el numero de embeds es mayor a 1 ponemos los botones de paginacion
            }else{
                let btn_atras =  new ButtonBuilder()
                    .setCustomId('atras')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji(`⬅`);
                let btn_siguiente =  new ButtonBuilder()
                    .setCustomId('siguiente')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji(`➡`);


                row = new ActionRowBuilder().addComponents(btn_atras, btn_siguiente, btn_salir);

                embedpaginas = await interaction.channel.send({
                    content: `**Navega con los _botones_ en el menú**`,
                    embeds: [embeds[0]],
                    components: [row]
                });
            }

            //Creación collector y se filtra que el usuario que de click sea la misma que ha puesto el comando, y el autor del mensaje sea el cliente (Toffu)
            const collector = embedpaginas.createMessageComponentCollector({filter: i => i?.isButton() && i?.user && i?.user.id == interaction.user.id && i?.message.author.id  == client.user.id, time: 100e3});

            collector.on("collect", async action => {
                switch (action?.customId) {
                    case 'atras':{
                        collector.resetTimer();
                        //Si la pagina a retroceder no es igual a la primera pagina entonces retrocedemos
                        if(pag_actual !== 0){
                            pag_actual -= 1
                            //Editamos el embed
                            await embedpaginas.edit({embeds: [embeds[pag_actual]], components: [embedpaginas.components[0]]}).catch(() => {});
                            await action?.deferUpdate();
                        } else{
                            //Reseteamos la cantidad de embeds -1
                            pag_actual = embeds.length-1
                            //Editamos el embed
                            await embedpaginas.edit({embeds: [embeds[pag_actual]], components: [embedpaginas.components[0]]}).catch(() => {});
                            await action?.deferUpdate();

                        }
                    }
                        break;
                    case 'siguiente':{
                        collector.resetTimer();
                        //Si la pagina a avanzar es mayor a las paginas actuales regresamos al inicio
                        if(pag_actual < embeds.length - 1){
                            //Aumentamos el valor de la pagina actual +1
                            pag_actual ++;
                            //Editamos el embed
                            await embedpaginas.edit({embeds: [embeds[pag_actual]], components: [embedpaginas.components[0]]}).catch(() => {});
                            await action?.deferUpdate();
                        } else{
                            //Reseteamos la cantidad al inicio
                            pag_actual = 0;
                            //Editamos el embed
                            await embedpaginas.edit({embeds: [embeds[pag_actual]], components: [embedpaginas.components[0]]}).catch(() => {});
                            await action?.deferUpdate();

                        }
                    }
                        break;
                    case 'exit':{
                        collector.stop();
                    }
                        break;
                    default:
                        break;
                }
            });
            collector.on("end", async () => {
                //desactivamos botones y editamos el mensaje
                embedpaginas.edit({content: "El tiempo ha expirado ⏳, utiliza denuevo el comando pokedéx 😊", components:[]}).catch(() => {});
                embedpaginas.suppressEmbeds(true);
                    
            });
        }
    }
}