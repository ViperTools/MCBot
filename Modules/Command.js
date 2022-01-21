const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = class {
    constructor(name, description, callback) {
        this.data = new SlashCommandBuilder().setName(name).setDescription(description),
        this.execute = callback
    }
}