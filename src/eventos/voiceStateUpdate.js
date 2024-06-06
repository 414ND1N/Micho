const { isVoiceChannelEmpty } = require('distube')

module.exports = async (oldState) => {
    
    //si el canal de voz es nulo, retornar
    if (!oldState?.channel) return

    // constantes
    const queue = this.queues.get(oldState)

    //Distube: Salir canal de voz si no hay usuarios en el canal
    if (isVoiceChannelEmpty(oldState)) {
        queue.stop();
    }

    //Distube: Pausar o reanudar la reproducción si el canal de voz está vacío
    if (isVoiceChannelEmpty(oldState)) {
        queue.pause()
    } else if (queue.paused) {
        queue.resume()
    }
}