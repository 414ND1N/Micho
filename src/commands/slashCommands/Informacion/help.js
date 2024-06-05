const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const fs = require('fs')
const buttonPagination = require('../../../utils/buttonPagination')


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
    async execute(client, interaction) {
        try {

            const commandFolders = await fs.readdirSync('./src/commands/slashCommands')
            const helpEmbeds = []

            for (const folder of commandFolders) {
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

                    const description = `${command.CMD.description || "Sin descripción"}`

                    if (command.CMD.type === "SUB_COMMAND" || command.CMD.type === "SUB_COMMAND_GROUP") {
                        subcommands.push(command)
                    } else {
                        categoryEmbed.addFields({
                            name: `\`/${command.CMD.name}\``,
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

            await buttonPagination(interaction, helpEmbeds)

        } catch (error) {
            console.error(error)

        }
    }
}

