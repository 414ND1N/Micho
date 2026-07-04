const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const fs = require('fs')
const buttonPagination = require('@/utils/button_pagination')

module.exports = {
    cooldown: 20,
    CMD: new SlashCommandBuilder()
        .setName("ayuda")
        .setNameLocalizations({
            "en-US": "help"
        })
        .setDescription('Muéstra todos los comandos disponibles 📚')
        .setDescriptionLocalizations({
            "en-US": 'Show all available commands 📚'
        })
    ,
    /**
    * @param {ChatInputCommandInteraction} interaction
    */
    async execute(interaction) {
        try {

            const { client } = interaction
            const commandFolders = await fs.readdirSync('./src/commands/slashCommands')
            const helpEmbeds = []

            // Verificar permisos de usuario actual (admin) para mostrar comandos de admin
            const isAdmin = await interaction.member.permissions.has(PermissionFlagsBits.Administrator)
            const filteredFolders = isAdmin ? commandFolders : commandFolders.filter(folder => folder !== 'admin')

            for (const folder of filteredFolders) {
                const commandFiles = fs.readdirSync(`./src/commands/slashCommands/${folder}`).filter(file => file.endsWith('.js'));
                const categoryEmbed = new EmbedBuilder() //Creacion embed con informacion de la variante shiny
                    .setTitle(folder)
                    .setTimestamp()
                    .setThumbnail(client.user.displayAvatarURL())

                const subcommands = []

                for (const file of commandFiles) {
                    const command = require(`./../${folder}/${file}`)

                    if (command.deleted) {
                        continue
                    }

                    const description = `${command.CMD.descriptionLocalized ?? command.CMD.description ?? "Sin descripción"}`

                    if (command.CMD.type === "SUB_COMMAND" || command.CMD.type === "SUB_COMMAND_GROUP") {
                        subcommands.push(command)
                    } else {
                        categoryEmbed.addFields({
                            name: `\`/${command.CMD.nameLocalized ?? command.CMD.name}\``,
                            value: description
                        })
                    }
                }

                if (subcommands.length > 0) {
                    categoryEmbed.addFields({
                        name: "Subcomandos",
                        value: subcommands.map(subcommand => `\`/${subcommand.CMD.name}\``).join("\n")
                    })
                }

                helpEmbeds.push(categoryEmbed)
            }

            await interaction.deferReply()
            await buttonPagination(interaction, helpEmbeds,60_000)

        } catch (error) {
            console.error(error)

        }
    }
}

