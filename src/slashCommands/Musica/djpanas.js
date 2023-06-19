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

        const voicechannel = interaction.member.voice.channel;
        const channel = client.channels.cache.get(process.env.ID_CANAL_DISCO);

        //comprobaciones previas
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

        await interaction.deferReply(); // Defer para respuestas de más de 30 segundos

        let tipo = interaction.options.getString("tipo") ?? 'Clasico'; //Si no se eligió un tipo toma el tipo clasico por defecto
        let args = 'https://www.youtube.com/playlist?list=PLtzt-E5Aq1-kGOPEbker6rjCQH6ZtKNz9'

        let DJ_PANAS = JSON.parse(process.env.DJ_PANAS);

        // itera sobre la lista DJ_PANAS
        for (let key in DJ_PANAS) {

            if (key === tipo) { // si el nombre coincide con el objeto actual
                args = DJ_PANAS[key]; // asigna el URL correspondiente
                break; // sale del bucle, ya se encontró el objeto
            }
        }

        client.distube.play(voicechannel, args, {
            member: interaction.member ?? undefined,
            textChannel: channel
        });

        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Reproducción DJ PANAS')
                    .setThumbnail("https://i.imgur.com/vMaawHJ.gif")
                    .setColor(process.env.COLOR)
                    .setDescription(`**Se agregó DJ PANAS \`${tipo}\` a la lista**`)
                    .addFields({ name: `Mira la lista en el canal ${channel}`, value: `😎  🔊 🎶` })
            ]
        })

    }
}