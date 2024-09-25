const {model, Schema} = require('mongoose')

let ChannelSchema = new Schema({
    Name: String,
    ID: String,
    GuildID: String,
})

module.exports = model('Channels', ChannelSchema, 'Channels')