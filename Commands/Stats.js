const { MessageActionRow, MessageButton } = require('discord.js')
const Command = require('../Modules/Command')

async function SendStats(interaction) {
    const canvas = await require('../Modules/StatsCanvas')(interaction)
    if (typeof(canvas) == 'string') interaction.reply(canvas)
    else interaction.reply({ files: [canvas] })
}

module.exports = new Command('stats', 'Sends the server stats.', SendStats)