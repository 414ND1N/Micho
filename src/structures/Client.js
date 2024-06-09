const { Client, Collection, GatewayIntentBits, Partials, ActivityType, PresenceUpdateStatus } = require('discord.js');
const BotUtils = require('./Utils');

// Instancia del cliente
module.exports = class extends Client {
    constructor(options = {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.DirectMessagePolls,
        ],
        partials: [
            Partials.User,
            Partials.Channel,
            Partials.GuildMember,
            Partials.Message,
            Partials.Reaction,
            Partials.ThreadMember,
        ],
        allowedMentions: {
            parse: ["roles", "users", "everyone"],
            repliedUser: false,
        },
        presence: {
            activities: [{
                name: process.env.STATUS,
                type: ActivityType[process.env.STATUS_TYPE
                ]
            }],
            status: PresenceUpdateStatus.Online
        },
    }) {
        super({
            ...options
        })

        this.commands = new Collection()
        this.voiceGenerator = new Collection()
        this.cooldowns = new Collection()
        this.commandsArray = []

        this.utils = new BotUtils(this)

        this.start()
    }

    async start() {
        await this.loadHandlers()
        await this.loadEvents()
        await this.loadCommands()
        this.login(process.env.BOT_TOKEN)
    }

    // !! Deprecated (Comandos prefix)

    async loadCommands() {
        console.log(`(/) Cargando comandos ...`.yellow)
        await this.commands.clear()

        this.commandsArray = []

        const RUTA_ARCHIVOS = await this.utils.loadFiles("/src/commands")

        if (RUTA_ARCHIVOS.length) {

            RUTA_ARCHIVOS.forEach(rutaArchivo => {
                try {
                    const COMANDO = require(rutaArchivo)
                    this.commands.set(COMANDO.CMD.name, COMANDO) // Se agrega el comando a la colección
                    this.commandsArray.push(COMANDO.CMD.toJSON()) // Se agrega el comando a la lista de comandos a publicar
                } catch (e) {
                    console.log(`(X) ERROR AL CARGAR EL COMANDO ${rutaArchivo}`.red)
                    console.log(e)
                }
            })
        }

        console.log(`(✔) ${this.commands.size} comandos cargados`.green)

        if (this?.application?.commands) {
            this.application.commands.set(this.commandsArray)
            console.log(`(*) ${this.commands.size} comandos publicados!`.white)
        }
    }

    async loadHandlers() {
        console.log(`(/) Cargando handlers ...`.yellow)

        const RUTA_ARCHIVOS = await this.utils.loadFiles("/src/handlers")

        if (RUTA_ARCHIVOS.length) {
            RUTA_ARCHIVOS.forEach((rutaArchivo) => {
                try {
                    require(rutaArchivo)(this)
                } catch (e) {
                    console.log(`(X) ERROR AL CARGAR EL HANDLER ${rutaArchivo}`.red)
                    console.log(e)
                }
            })
        }
        console.log(`(✔) ${RUTA_ARCHIVOS.length} Handlers Cargados`.green)
    }

    async loadEvents() {
        console.log(`(/) Cargando eventos ...`.yellow)

        const RUTA_ARCHIVOS = await this.utils.loadFiles("/src/eventos")
        this.removeAllListeners()

        if (RUTA_ARCHIVOS.length) {
            RUTA_ARCHIVOS.forEach((rutaArchivo) => {
                try {
                    const EVENTO = require(rutaArchivo)
                    if (EVENTO.once) {
                        this.once(EVENTO.name, (...args) => EVENTO.execute(...args));
                    } else {
                        this.on(EVENTO.name, (...args) => EVENTO.execute(...args));
                    }
                } catch (e) {
                    console.log(`(X) ERROR AL CARGAR EL EVENTO ${rutaArchivo}`.red)
                    console.log(e)
                }
            })
        }
        console.log(`(✔) ${RUTA_ARCHIVOS.length} Eventos Cargados`.green)
    }

}