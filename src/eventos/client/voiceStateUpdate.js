const { Events } = require('discord.js');
const { isVoiceChannelEmpty } = require('distube');

module.exports = {
    name: Events.VoiceStateUpdate,
    execute(oldState) {

        try {
            const queue = oldState.client?.distube?.queues.get(oldState)
            if (!queue) return
            
            // Pausar o renaudar la música si el canal de voz se queda vacío
            if (isVoiceChannelEmpty(oldState)) {
                queue.pause()
                setTimeout(async () => {
                    const voice = oldState.client?.distube?.voices.get(oldState)
                    if (voice && isVoiceChannelEmpty(oldState)) {
                        // Salir del canal de voz si se queda vacío por 1 minuto
                        voice.leave()
                    }
                }, 60_000)
            } else if (queue.paused) {
                queue.resume()
            }
        } catch (error) {
            console.error(error)
        }
    }
}