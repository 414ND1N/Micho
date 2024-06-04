const { EmbedBuilder } = require("discord.js");

function buildProgressBar(timeElapsed, totalTime, length) {
  const percentage = timeElapsed / totalTime;
  const progressLength = Math.floor(length * percentage);
  const emptyLength = length - progressLength;

  const progressBar =
    "▬".repeat(progressLength) + "🔘" + "▬".repeat(emptyLength);

  return progressBar;
}

function getTimeString(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.round(time % 60);
  const timeString = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
  return timeString;
}

module.exports = {
  ALIASES: ["enreproduccion"],
  DESCRIPTION: "Ver la duración de la canción actual.",
  async execute(client, message, args, prefix) {
    const queue = client.distube.getQueue(message);

    if (!queue) {
      const noQueueError = new EmbedBuilder()
        .setTitle(":x: No se encontró ninguna cola.")
        .setDescription("No hay canciones en la cola para mostrar.")
        .setColor(process.env.COLOR_ERROR);
      return message.reply({ embeds: [noQueueError] });
    }

    const currentSong = queue.songs[0];
    const timeElapsed = queue.currentTime;
    const totalTime = currentSong.duration;

    const progressBar = buildProgressBar(timeElapsed, totalTime, 10);

    await message
      .reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`:musical_note: ${currentSong.name}`)
            .setDescription(
              `**${getTimeString(
                timeElapsed
              )}** ${progressBar} **${getTimeString(totalTime)}**`
            )
            .setThumbnail(currentSong.thumbnail)
            .setColor(process.env.COLOR),
        ],
      })
      .then((msg) => {
        setTimeout(() => msg.delete(), 20000);
      })
      .catch(/*Error*/);
  },
};
