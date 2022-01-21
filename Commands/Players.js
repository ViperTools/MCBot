const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')
const Command = require('../Modules/Command')
const { GetPlayers } = require('../Modules/API')

async function SendPlayers(interaction) {
   GetPlayers().then(players => {
        if (!players.list) {
            interaction.reply({content: 'There are no players online.'})
            return
        }
        let s = ''
        for (let player of players.list) {
            s += `${player}\n`
        }
        const embed = new MessageEmbed().setTitle('Online Players').setDescription(s)
        interaction.reply({embeds: [embed]})
    }).catch(e => interaction.reply({content: 'An error occured. ```js\n' + e + '```', ephemeral: true}))
}

module.exports = new Command('players', 'Sends a list of online players.', SendPlayers)