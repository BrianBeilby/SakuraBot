const { Schema, model } = require('mongoose');

const themeSongSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    song: {
        type: String,
        required: true,
    },
});

module.exports = model('ThemeSong', themeSongSchema);