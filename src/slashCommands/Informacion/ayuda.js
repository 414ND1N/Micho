const { SlashCommandBuilder, EmbedBuilder, ComponentType, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js')

module.exports = {
    CMD: new SlashCommandBuilder()
        .setDescription("Obten la lista de comandos de una cierta categoría")
        .setDMPermission(false), //No se puede usar en DM

    async execute(interaction) {

        const { client, channel, values } = interaction;
        const emojis = {
            informacion: "🔍",
            musica: "🎶",
            variedad: "🍀"

        }

        // Filtrar comandos por nombre, y retornar el id
        function getCommand(name) {
            const getCommandID = client.application.commands.cache
                .filter((cmd) => cmd.name === name)
                .map((cmd) => cmd.id);

            return getCommandID
        }
        console.log(client.commands)
        const directories = [
            
            ...new Set(client.commands.map((cmd) => cmd.folder))
        ];

        const formatString = (str) =>
            `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

        const categories = directories.map((dir) => {
            const getCommands = client.commands
                .filter((cmd) => cmd.folder === dir)
                .map((cmd) => {
                    return {
                        name: cmd.data.name || 'No hay nombre para este comando',
                        description: cmd.data.description || 'No hay descripción para este comando',
                    };
                });

            return {
                directory: formatString(dir),
                commands: getCommands
            };
        });

        const embed = new EmbedBuilder()
            .setTitle("Menú de ayuda")
            .setDescription("Selecciona una categoría para ver los comandos disponibles")
            .setColor(process.env.COLOR)
            .setAuthor({ name: `Comandos de ${client.user.username}`, iconURL: client.user.avatarURL() })

        const components = (state) => [
            new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('help-menu')
                    .setPlaceholder('Selecciona una categoría')
                    .setDisabled(state)
                    .addOptions(
                        categories.map((cmd) => {
                            return {
                                label: cmd.directory,
                                value: cmd.directory.toLowerCase(),
                                description: `commandos de la categoría \`${cmd.directory}\`.`,
                                emoji: emojis[cmd.directory.toLowerCase() || null]
                            };
                        })
                    )
            )
        ];

        const initialMessage = await interaction.reply({
            embeds: [embed],
            components: components(false)
        });

        const filter = (interacion) =>
            interacion.user.id === interaction.member.id

        const collector = channel.createMessageComponentCollector({
            filter,
            componentType: ComponentType.StringSelect,
        });

        collector.on("collect", async (interaction) => {
            const [directory] = values;
            const category = categories.find(
                (x) => x.directory.toLowerCase() === directory
            );

            const categoryEmbed = new EmbedBuilder()
                .setTitle(`${emojis[directory.toLowerCase() || null]} Comandos de ${formatString(directory)}`)
                .setDescription(`Una lista de todos los comandos de la categoría \`${directory}\`.`)
                .setColor(process.env.COLOR)
                .addFields(
                    category.commands.map((cmd)=>{
                        return {
                            name: `</${cmd.name}:${getCommand(cmd.name)}>`, // muestra un comando clickeable
                            values: `\`${cmd.description}\``,
                            inline: true
                        };
                    })
                );

                interaction.update({
                    embeds: [categoryEmbed]
                });
        });

        collector.on("end", ()=>{
            initialMessage.edit({components: components(true)});
        });
    },
};