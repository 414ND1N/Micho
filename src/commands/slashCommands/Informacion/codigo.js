const { SlashCommandBuilder,EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle} = require('discord.js')
const { COLOR } = require('@/config')

module.exports = {
    CMD: new SlashCommandBuilder()
        .setName("codigo")
        .setNameLocalizations({
            "en-US": "code"
        })
        .setDescription("Repositorio de mi código ☺")
        .setDescriptionLocalizations({
            "en-US": "My code repository ☺"
        })
    ,
    async execute(interaction){

        const url = new ButtonBuilder()
			.setLabel('Enlace al repositorio')
			.setStyle(ButtonStyle.Link)
            .setURL(process.env.URL_REPO)
            .setEmoji('🔗')

		const row = new ActionRowBuilder().addComponents(url)

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Código fuente')
                    .setColor(COLOR)
                    .setDescription(`Puedes encontrar mi código fuente en mi repositorio de GitHub. Haz clic en el botón para acceder al repositorio.`)  
            ],
            components: [row]
        })
    }
} 