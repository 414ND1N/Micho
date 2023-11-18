const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const axios = require('axios');
module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("waifu")
        .setDescription("Imagen aleatoria de una mona china")
        .addSubcommand(subcommand =>
            subcommand.setName('sfw')
                .setDescription('Imagen SFW (Safe For Work)')
                .addStringOption(option =>
                    option.setName('categoria')
                        .setDescription('Categoría de la imagen')
                        .addChoices(
                            { name: 'Waifu', value: 'waifu' },
                            { name: 'Gato', value: 'neko' },
                            { name: 'Bully', value: 'bully' },
                            { name: 'Acaricia', value: 'cuddle' },
                            { name: 'Lloro', value: 'cry' },
                            { name: 'Abrazo', value: 'hug' },
                            { name: 'Beso', value: 'kiss' },
                            { name: 'Palmada', value: 'pat' },
                            { name: 'Lamer', value: 'lick' },
                            { name: 'Lanzar', value: 'yeet' },
                            { name: 'Sonrojar', value: 'blush' },
                            { name: 'Sonreir', value: 'smile' },
                            { name: 'Saludar', value: 'wave' },
                            { name: 'Esos cinco', value: 'highfive' },
                            { name: 'Agarrar manos', value: 'handhold' },
                            { name: 'Comiendo', value: 'nom' },
                            { name: 'Morder', value: 'bite' },
                            { name: 'Bofetada', value: 'slap' },
                            { name: 'Guiñar', value: 'wink' },
                            { name: 'Bailar', value: 'dance' },
                            { name: 'Perturbado', value: 'cringe' }
                        )
                    .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('nsfw')
                .setDescription('Imagen NSFW (Not Safe For Work)')
                .addStringOption(option =>
                    option.setName('categoria')
                        .setDescription('Categoría de la imagen')
                        .addChoices(
                            { name: 'Waifu', value: 'waifu' },
                            { name: 'Gato', value: 'neko' }
                        )
                    .setRequired(true)
                )
        )
        ,
    async execute(client, interaction){
        
        //verificar si el canal es NSFW
        const CANAL_NSFW = client.channels.cache.get(process.env.ID_CANAL_NSFW);
        const CANAL_PRUEBAS = client.channels.cache.get(process.env.ID_CANAL_PRUEBAS);

        const sub_command = interaction.options.getSubcommand(); // Tipo de la imagen (SFW o NSFW)
        const categoria = interaction.options.getString('categoria'); // Categoría de la imagen
        const canales_permitidos = [CANAL_NSFW, CANAL_PRUEBAS]

        if(sub_command == "nsfw" && !canales_permitidos.includes(interaction.channel)){
            return interaction.reply({ embeds: [
                new EmbedBuilder()
                    .setTitle(`Comando no disponible 🤐`)
                    .setDescription(`Este comando solo está disponible en ${CANAL_NSFW}`)
                    .setColor(process.env.COLOR)
                    .setTimestamp()
                    .setThumbnail(`https://i.imgur.com/gqL0iZa.gif`)
            ], ephemeral: true })
        }

        await interaction.deferReply(); // Defer para respuestas de más de 3 segundos
        
        const url_api = `https://waifu.pics/api/${sub_command}/${categoria}`;
        const response = await axios.get(url_api);
        const img_url = response.data.url;

        const AUTHOR = interaction.member?.nickname?? interaction.user.username; // Si no tiene apodo, se usa el nombre de usuario
    
        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${AUTHOR} invocó a una mona china 🐵 🇯🇵 `)
                    .setColor(process.env.COLOR)
                    .setImage(img_url)
            ]
        })
    }
}