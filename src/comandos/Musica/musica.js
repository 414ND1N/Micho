const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { RepeatMode } = require("distube");

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
  ALIASES: ["music", "m"],
  DESCRIPTION: "Sirve para controlar la reproducción de música",

  async execute(client, message, args, prefix) {
    //constantes
    const SUB = args[0].toLowerCase();
    const CANAL_DISCO = client.channels.cache.get(process.env.ID_CANAL_DISCO);

    //Comprobaciones previas
    if (!SUB) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(process.env.COLOR_ERROR)
            .setDescription(
              `Tienes que especificar la acción a realizar con la música`
            ),
        ],
      });
    }
    if (!message.member.voice?.channel) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(process.env.COLOR_ERROR)
            .setDescription(
              `Tienes que estar en un canal de voz para ejecutar el comando 🤨`
            ),
        ],
      });
    }
    //constantes
    const VOICE_CHANNEL = message.member.voice.channel;
    const COM_NO_QUEUE = ["play", "reproducir"];
    if (
      !client.distube.getQueue(VOICE_CHANNEL) &&
      !COM_NO_QUEUE.includes(SUB) &&
      !COM_NO_QUEUE.includes(args.slice(1).join(" "))
    ) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(process.env.COLOR_ERROR)
            .setDescription(
              `No hay música en reproducción para ejecutar este comando`
            ),
        ],
      });
    }
    //constantes
    const QUEUE = await client.distube.getQueue(VOICE_CHANNEL);

    switch (SUB) {
      case "play":
      case "reproducir": {
        let cancion = args.slice(1).join(" ");

        //Comprobaciones previas
        if (!cancion) {
          return message.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(process.env.COLOR_ERROR)
                .setDescription(
                  `Tienes que especificar el nombre de una canción 🤨`
                ),
            ],
          });
        }

        client.distube
          .play(VOICE_CHANNEL, cancion, {
            member: message.member,
            textChannel: CANAL_DISCO,
            message,
          })
          .catch((err) => {
            console.log("Error con la reproducción de la música".red);
          });

        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Reproducción música")
              .setThumbnail("https://i.imgur.com/WHCwA6t.gif")
              .setColor(process.env.COLOR)
              .setDescription(`Buscando \`${cancion}\` ...`),
          ],
        });
      }
      case "resume":
      case "resumir": {
        client.distube.resume(message);
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Resumen música")
              .setThumbnail("https://i.imgur.com/Zqg98ma.gif")
              .setColor(process.env.COLOR)
              .addFields({
                name: `Se resumió la reproducción`,
                value: `🐱‍🏍 🎶🎵`,
              }),
          ],
        });
      }
      case "pause":
      case "pausar": {
        client.distube.pause(message);
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Pausar música")
              .setThumbnail("https://i.imgur.com/kY0gh91.gif")
              .setColor(process.env.COLOR)
              .addFields({ name: `Se pausó la música`, value: `🚦🛑` }),
          ],
        });
      }
      case "skip":
      case "siguiente": {
        if (!QUEUE.autoplay && QUEUE.songs.length <= 1) {
          return message.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(process.env.COLOR_ERROR)
                .setDescription(
                  `No hay más música en la lista para reproducir`
                ),
            ],
          });
        }
        client.distube.skip(message);
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Siguiente música")
              .setThumbnail("https://i.imgur.com/9fBJ0s7.gif")
              .setColor(process.env.COLOR)
              .addFields({
                name: `Se saltó a la siguiente música`,
                value: `⏭ ⏭ ⏭ `,
              }),
          ],
        });
      }
      case "previous":
      case "anterior": {
        client.distube.previous(message);
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Música anterior")
              .setThumbnail("https://i.imgur.com/9fBJ0s7.gif")
              .setColor(process.env.COLOR)
              .addFields({
                name: `Se saltó a la canción anterior`,
                value: `⏮ ⏮ ⏮`,
              }),
          ],
        });
      }
      case "shuffle":
      case "mezclar": {
        client.distube.shuffle(message);
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Mezcla lista música")
              .setThumbnail("https://i.imgur.com/8L4WreH.gif")
              .setColor(process.env.COLOR)
              .addFields({
                name: `Se mezcló la lista de música`,
                value: `🎶 😎👍`,
              }),
          ],
        });
      }
      case "detener":
      case "stop": {
        client.distube.stop(message);
        return;
      }
      case "volumen":
      case "volume": {
        let porcentaje = Number(args[1]);

        //Comprobaciones previas
        if (!porcentaje) {
          return message.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(process.env.COLOR_ERROR)
                .setDescription(`Tienes que especificar el volumen 🤨`),
            ],
          });
        }
        if (porcentaje < 0 || porcentaje > 200) {
          return message.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(process.env.COLOR)
                .setDescription(`Solo se permite del \`0%\` al \`200%\``),
            ],
          });
        }

        client.distube.setVolume(message, porcentaje);
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Volúmen música")
              .setColor(process.env.COLOR)
              .addFields({
                name: `Se cambió el volúmen a \`${porcentaje} %\``,
                value: `🔈🔉 🔊`,
              })
              .setThumbnail("https://i.imgur.com/IPLiduk.gif"),
          ],
        });
      }
      case "repetir":
      case "repeat": {
        let tipo = parseInt(args[1]);
        let modo;
        //Comprobaciones previas
        if (isNaN(tipo)) {
          return message.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(process.env.COLOR_ERROR)
                .setDescription(`Tienes que especificar el módo a repetir`),
            ],
          });
        }
        if (tipo < 0 || tipo > 2) {
          return message.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(process.env.COLOR_ERROR)
                .setDescription(`Los tipos de repetición válidos son: `)
                .addFields({ name: `0`, value: `Repetición desactivada` })
                .addFields({ name: `1`, value: `Repetición canción actual` })
                .addFields({ name: `2`, value: `Repetición lista completa` }),
            ],
          });
        }
        switch (client.distube.setRepeatMode(VOICE_CHANNEL, tipo)) {
          case RepeatMode.DISABLED:
            modo = "desactivado";
            break;
          case RepeatMode.SONG:
            modo = "canción actual";
            break;
          case RepeatMode.QUEUE:
            modo = "lista completa";
            break;
        }
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Repetición música")
              .setColor(process.env.COLOR)
              .addFields({
                name: `Se cambió la repetición a \`${modo}\``,
                value: `🔄 🎶 🎵`,
              })
              .setThumbnail("https://i.imgur.com/Cm5hy47.gif"),
          ],
        });
      }
      case "lista":
      case "queue": {
        let listaqueue = []; //Array vació donde estaran las canciones
        var maxsongs = 10; //Número de canciones que se mostraran por página del embed

        //mapeado canciones al array
        for (let i = 0; i < QUEUE.songs.length; i += maxsongs) {
          var canciones = QUEUE.songs.slice(i, i + maxsongs);
          listaqueue.push(
            canciones
              .map(
                (cancion, index) =>
                  `**\`${i + ++index}\`** - [\`${cancion.name}\`](${
                    cancion.url
                  })`
              )
              .join("\n ")
          );
        }
        var limite = listaqueue.length;
        var embeds = [];
        //loop entre todas las canciones hasta el límite
        for (let i = 0; i < limite; i++) {
          let desc = String(listaqueue[i]).substring(0, 2048); //Asegurar la longitud del mensaje para evitar errores
          //Creación embed por cada limite (maxsongs)
          const el_embed = new EmbedBuilder()
            .setTitle(
              `🎶  Cola de reproducción - \`[${QUEUE.songs.length} ${
                QUEUE.songs.length > 1 ? "canciones" : "canción"
              }]\``
            )
            .setColor(process.env.COLOR)
            .setDescription(desc);

          //Si el numero de canciones a mostrar es mayor a 1 especificamos en el embed que canción se esta reproduciendo en ese momento
          if (QUEUE.songs.length > 1)
            el_embed.addFields({
              name: `🎧 Canción actual`,
              value: `**[\`${QUEUE.songs[0].name}\`](${QUEUE.songs[0].url})**`,
            });
          await embeds.push(el_embed);
        }

        return paginacion();

        //función para paginacion
        async function paginacion() {
          let pag_actual = 0;
          let embedpaginas = null;
          let row = null;

          //Creacion boton salir para el menú
          let btn_salir = new ButtonBuilder()
            .setCustomId("exit")
            .setLabel("❌ Salir")
            .setStyle(ButtonStyle.Danger);

          //Si solo hay 1 embed enviamos el mensaje sin botones de navegacion
          if (embeds.length === 1) {
            row = new ActionRowBuilder().addComponents(btn_salir);

            embedpaginas = await message.channel
              .send({
                embeds: [embeds[0]],
                components: [row],
              })
              .catch(() => {});

            //Si el numero de embeds es mayor a 1 ponemos los botones de paginacion
          } else {
            let btn_atras = new ButtonBuilder()
              .setCustomId("atras")
              .setStyle(ButtonStyle.Success)
              .setEmoji(`⬅`);

            let btn_siguiente = new ButtonBuilder()
              .setCustomId("siguiente")
              .setStyle(ButtonStyle.Success)
              .setEmoji(`➡`);

            let btn_inicio = new ButtonBuilder()
              .setCustomId("inicio")
              .setLabel("Inicio")
              .setStyle(ButtonStyle.Primary)
              .setEmoji(`🏠`);

            row = new ActionRowBuilder().addComponents(
              btn_inicio,
              btn_atras,
              btn_siguiente,
              btn_salir
            );

            //Enviamos el mensaje embed con los botones
            embedpaginas = await message.channel.send({
              content: `**Navega con los _botones_ en el menú**`,
              embeds: [
                embeds[0].setFooter({
                  text: `Página ${pag_actual + 1} / ${embeds.length}`,
                }),
              ],
              components: [row],
            });
          }

          //Creación collector y se filtra que el usuario que de click sea la misma que ha puesto el comando, y el autor del mensaje sea el cliente (Toffu)
          const collector = embedpaginas.createMessageComponentCollector({
            filter: (i) =>
              i?.isButton() &&
              i?.user &&
              i?.user.id == message.author.id &&
              i?.message.author.id == client.user.id,
            time: 30e3,
          });
          //Escuchamos los eventos del collector
          collector.on("collect", async (b) => {
            //Si el usuario que hace click al boton no es el mismo a que puso el comando, se lo indicamos
            if (b?.user.id != message.author.id)
              return b?.reply({
                content: `❌ Solo quien uso el comando de queue puede navegar entre páginas`,
              });

            switch (b?.customId) {
              case "atras":
                {
                  collector.resetTimer();
                  //Si la pagina a retroceder no es igual a la primera pagina entonces retrocedemos
                  if (pag_actual !== 0) {
                    pag_actual -= 1;
                    //Editamos el embed
                    await embedpaginas
                      .edit({
                        embeds: [
                          embeds[pag_actual].setFooter({
                            text: `Página ${pag_actual + 1} / ${embeds.length}`,
                          }),
                        ],
                        components: [embedpaginas.components[0]],
                      })
                      .catch(() => {});
                    await b?.deferUpdate();
                  } else {
                    //Reseteamos la cantidad de embeds -1
                    pag_actual = embeds.length - 1;
                    //Editamos el embed
                    await embedpaginas
                      .edit({
                        embeds: [
                          embeds[pag_actual].setFooter({
                            text: `Página ${pag_actual + 1} / ${embeds.length}`,
                          }),
                        ],
                        components: [embedpaginas.components[0]],
                      })
                      .catch(() => {});
                    await b?.deferUpdate();
                  }
                }
                break;
              case "siguiente":
                {
                  collector.resetTimer();
                  //Si la pagina a avanzar es mayor a las paginas actuales regresamos al inicio
                  if (pag_actual < embeds.length - 1) {
                    //Aumentamos el valor de la pagina actual +1
                    pag_actual++;
                    //Editamos el embed
                    await embedpaginas
                      .edit({
                        embeds: [
                          embeds[pag_actual].setFooter({
                            text: `Página ${pag_actual + 1} / ${embeds.length}`,
                          }),
                        ],
                        components: [embedpaginas.components[0]],
                      })
                      .catch(() => {});
                    await b?.deferUpdate();
                  } else {
                    //Reseteamos la cantidad al inicio
                    pag_actual = 0;
                    //Editamos el embed
                    await embedpaginas
                      .edit({
                        embeds: [
                          embeds[pag_actual].setFooter({
                            text: `Página ${pag_actual + 1} / ${embeds.length}`,
                          }),
                        ],
                        components: [embedpaginas.components[0]],
                      })
                      .catch(() => {});
                    await b?.deferUpdate();
                  }
                }
                break;
              case "inicio":
                {
                  collector.resetTimer();
                  //Si la pagina a retroceder no es igual a la primera pagina entonces retrocedemos
                  pag_actual = 0;
                  await embedpaginas
                    .edit({
                      embeds: [
                        embeds[pag_actual].setFooter({
                          text: `Página ${pag_actual + 1} / ${embeds.length}`,
                        }),
                      ],
                      components: [embedpaginas.components[0]],
                    })
                    .catch(() => {});
                  await b?.deferUpdate();
                }
                break;
              case "exit":
                {
                  collector.stop();
                }
                break;
              default:
                break;
            }
          });
          collector.on("end", () => {
            //desactivamos botones y editamos el mensaje
            embedpaginas
              .edit({
                content:
                  "El tiempo ha expirado ⏳, utiliza denuevo el comando queue  😊",
                components: [],
              })
              .catch(() => {});
            embedpaginas.suppressEmbeds(true);
          });
        }
      }
      case "nowplaying":
      case "enreproduccion": {
        const currentSong = QUEUE.songs[0];
        const timeElapsed = QUEUE.currentTime;
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
            setTimeout(() => msg.delete(), 10000);
          })
          .catch(/*Error*/);

        return;
      }
      case "saltar":
      case "jump": {
        let num_cancion = Number(args[1]);

        //Comprobaciones previas
        if (!args[1]) {
          return message.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(process.env.COLOR_ERROR)
                .setDescription(
                  `Tienes que especificar el número de canción 🤨`
                ),
            ],
          });
        }
        if (num_cancion < 2) {
          return message.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(process.env.COLOR)
                .setDescription(
                  `No se puede saltar a la canción que se esta reproduciendo`
                ),
            ],
          });
        }
        if (num_cancion > QUEUE.songs.length) {
          return message.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(process.env.COLOR)
                .setDescription(
                  `La lista unicamente cuenta con \`${QUEUE.songs.length}\` canciones`
                ),
            ],
          });
        }

        client.distube.jump(message, num_cancion - 1);
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Salto en lista de música")
              .setThumbnail("https://i.imgur.com/bDO4VTw.gif")
              .setColor(process.env.COLOR)
              .addFields({
                name: `Se saltó a la canción número \`${num_cancion}\``,
                value: `🐱‍🏍 🎶🎵`,
              }),
          ],
        });
      }
    }
  },
};
