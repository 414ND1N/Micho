const {model, Schema} = require('mongoose')

let RoleSchema = new Schema({
    Name: String,
    ID: String,
    GuildID: String,
})

module.exports = model('Roles', RoleSchema, 'Roles')