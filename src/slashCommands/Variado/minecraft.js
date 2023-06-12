const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { PermissionFlagsBits } = require('discord.js')
const { AttachmentBuilder } = require('discord.js');
const { Buffer } = require('buffer');

module.exports = {
    CMD: new SlashCommandBuilder()
        .setDescription("Obtiene información de Minecraft")
        .addSubcommand(subcommand =>
            subcommand.setName('skin')
                .setDescription('Visualiza la skin de un jugador en específico')
                .addStringOption(option =>
                    option.setName('nombre')
                        .setDescription('Nombre del jugador')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('tipo')
                        .setDescription('Tipo en la que se visualizará la skin')
                        .addChoices(
                            { name: 'Cuerpo', value: 'body' },
                            { name: 'Cabeza', value: 'helm' },
                            { name: 'Busto', value: 'bust' },
                            { name: 'Skin', value: 'skin' }
                        )
                )
        ),

    async execute(client, interaction, prefix) {

        await interaction.deferReply(); // Defer si la respuesta tarda más de 3 segundos
        const wait = require('node:timers/promises').setTimeout;

        //constantes
        const SUB = interaction.options.getSubcommand();

        switch (SUB) {
            case 'skin':
                const nombre = interaction.options.getString('nombre');
                //comprobar si viene tipo, si no, poner por defecto body
                const tipo = interaction.options.getString('tipo') == null ? 'body' : interaction.options.getString('tipo');

                let img_url = `https://mineskin.eu/armor/${tipo}/${nombre}.png`;

                //Si es helm o skin, cambiar el formato del URL
                if(tipo == 'helm' || tipo == 'skin'){
                    img_url = `https://mineskin.eu/${tipo}/${nombre}.png`;
                }

                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR)
                            .setTitle(`Minecraft | Skin de \`${nombre}\``)
                            .setImage(img_url) // Nombre del archivo adjunto
                    ]
                })

            default:
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR_ERROR)
                            .setTitle(`Subcomando no encontrado 💀`)
                    ]
                })

                break;
        }
    }
}