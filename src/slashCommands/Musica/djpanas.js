const { SlashCommandBuilder, EmbedBuilder, } = require('discord.js')
module.exports = {
    CMD: new SlashCommandBuilder()
        .setDescription("Reproducir DJ-PANAS")
        .addStringOption(option =>
            option.setName("tipo")
                .setDescription("Tipo de contenido")
                .addChoices(
                    { name: "Clásico", value: "Clasico" },
                    { name: "Anime", value: "Anime" },
                    { name: "Video-juegos", value: "Videogames" },
                    { name: "K-On", value: "K-On" },
                    { name: "Bochi the Rock", value: "Bochi" },
                    { name: "Kanako Ito", value: "Kanako" },
                    { name: "Variedad", value: "Random" },
                )
        ),
    async execute(client, interaction, prefix) {
        try {
            let tipo = interaction.options.getString("tipo");
            let args = 'https://www.youtube.com/playlist?list=PLtzt-E5Aq1-kGOPEbker6rjCQH6ZtKNz9'

            let DJ_PANAS = JSON.parse(process.env.DJ_PANAS);

            // itera sobre la lista DJ_PANAS
            for (let key in DJ_PANAS) {
                if (key === tipo) { // si el nombre coincide con el objeto actual
                    args = DJ_PANAS[key]; // asigna el URL correspondiente
                    break; // sale del bucle, ya se encontró el objeto
                }
            }

            // muestra el URL correspondiente (o un mensaje si no se encontró el objeto)
            if (args == '') {
                args = DJ_PANAS['Clasico']
            }
            
            const voicechannel = interaction.member.voice.channel;
            const CANAL_DISCO = client.channels.cache.get(process.env.ID_CANAL_DISCO);

            //comprobaciones previas :o
            if (!voicechannel) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(process.env.COLOR_ERROR)
                            .setDescription(`Tienes que estar en un canal de voz para ejecutar el comando 🤨`)
                    ],
                    ephemeral: true
                })
            }

            client.distube.play(voicechannel, args, {
                member: interaction.member,
                textChannel: CANAL_DISCO
            });

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Reproducción DJ PANAS')
                        .setThumbnail("https://i.imgur.com/vMaawHJ.gif")
                        .setColor(process.env.COLOR)
                        .addFields({ name: `**Se agregó DJ PANAS \`${tipo}\` a la lista**`, value: `😎  🔊 🎶` })
                ]
            })

        } catch (e) {
            interaction.reply({ content: `**Ha ocurrido un error al recargar el bot**\nMira la consola para mas detalle :P`, ephemeral: true });
            return console.log(e);
        }
    }
}