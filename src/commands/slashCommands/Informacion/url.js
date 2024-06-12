const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    cooldown: 20,
    CMD: new SlashCommandBuilder()
        .setName("enlace")
        .setNameLocalizations({
            "en-US": "url"
        })
        .setDescription('Verifica si el enlace puede ser peligroso.')
        .setDescriptionLocalizations({
            "en-US": 'Check if the url can be dangerous.'
        })
        .addStringOption(option =>
            option
                .setName("enlace")
                .setNameLocalizations({
                    "en-US": "url"
                })
                .setDescription("Enlace a verificar.")
                .setDescriptionLocalizations({
                    "en-US": "Url to check."
                })
                .setRequired(true)
        )
    ,
    /**
    * @param {ChatInputCommandInteraction} interaction
    */
    async execute(interaction) {
        
        await interaction.deferReply({ ephemeral: true })

        try {

            const { options } = interaction
            const url = options.getString("enlace")

            const apiURL = `https://www.virustotal.com/vtapi/v2/url/report?apikey=${process.env.VIRUST_API_KEY}&resource=${encodeURI(url)}`
            const response = await axios.get(apiURL)
            const data = response.data

            if (data.verbose_msg === 'Resource does not exist in the dataset') {
                return 'El enlace no existe en la base de datos.'
            }

            var results = ''
            if (data.positives > 0) {
                results = '> ❗ Este enlace contiene virus. Usa el enlace de abajo para más información.'
            } else {
                results = '> ✅ Este enlace no contiene virus.'
            }

            // const dataObj = {
            //     url : `> 🔗 Más información: \`${data.url}\``,
            //     scanDate : `> 🔗 Más información: \`<t:${Math.floor((new Date(data.scan_date).getTime())/1000)}:F>\``,
            //     positives : `> 🦠 Positivos: \`${data.positives}\`/\`${data.total}\``,
            //     results : results,
            //     full: `> Click [aquí](${data.permalink}) para ver el reporte completo.`
            // }

            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`🔍 **Los resultados del scaneo:**`)
                        .setColor("Random")
                        .addFields(
                            { name: 'Enlace', value: `> 🔗 Más información: \`${data.url}\`` },
                            { name: 'Positivos', value: `> 🦠 Positivos: \`${data.positives}\`/\`${data.total}\`` },
                            { name: 'Resultados', value: results },
                            { name: 'Reporte completo', value: `> Click [aquí](${data.permalink}) para ver el reporte completo.` }
                        )
                        .setFooter({
                            text: 'Ten en cuenta que la fecha de escanoe es de la última vez que virus total revisó la página.'
                        })
                        .setTimestamp()
                ],
                ephemeral: true
            })
        } catch (error) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`🔍 Verificación de enlace`)
                        .setColor("Random")
                        .setDescription('❌ **Ha ocurrido un error al verificar el enlace.**')
                        .setTimestamp()
                ],
                ephemeral: true
            })
        }

    }
}

