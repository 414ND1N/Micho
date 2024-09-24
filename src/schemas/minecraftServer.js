const {model, Schema} = require('mongoose')

let minecraftServerSchema  = new Schema({
    Nombre: String,
    IP: String,
    JavaIP: String,
    IconUrl: String,
})

module.exports = model('minecraftServer', minecraftServerSchema, 'minecraftServer')