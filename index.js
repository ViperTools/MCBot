require('dotenv').config()
const { Client, Intents, Collection, MessageActionRow, MessageButton } = require('discord.js')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { token, guildId } = process.env
const fs = require('fs')
const { Whitelist, Blacklist, GetWhitelist } = require('./Modules/Whitelist')

const commands = []
const commandsFiles = fs.readdirSync('./Commands')
const clientId = '896544206330417172'

const rateLimits = {}
const rateLimit = 30

const rest = new REST({ version: '9' }).setToken(token)
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
client.commands = new Collection()

for (const file of commandsFiles) {
    const command = require(`./Commands/${file}`)
    commands.push(command.data.toJSON())
    client.commands.set(command.data.name, command)
}

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        const timeLeft = Date.now() - rateLimits[interaction.user.id]
        if (timeLeft < rateLimit * 1000) {
            interaction.reply({ content: `Slow down there! (${rateLimit - Math.round(timeLeft/1000)}s left)`, ephemeral: true })
            return
        }
        rateLimits[interaction.user.id] = Date.now()
        const command = client.commands.get(interaction.commandName)
        if (!command) return
        
        try {
            await command.execute(interaction)
        }
        catch (e) {
            await interaction.reply({ content: 'There was an error while executing this command! ```js\n' + e + '```', ephemeral: true })
        }
    }
    else if (interaction.isButton()) {
        if (interaction.user.id != interaction.message.interaction.user.id) {
            interaction.reply({content: 'This is not your message to reply to!', ephemeral: true})
            return
        }
        if (interaction.customId == 'whitelist_yes') {
            const user = interaction.message.content.match(/(?<=\s)[^\s+]+(?=\?)/)[0]
            if (GetWhitelist(interaction.user.id)) {
                await Blacklist(interaction.user.id)
            }
            Whitelist(interaction.user.id, user).then(() => {
                interaction.update({content: `Whitelisted ${user}.`, components: []})
            }).catch((e) => {
                interaction.update({content: 'An error occured: ```js\n' + e + '```', components: []})
            })
        }
        else if (interaction.customId == 'whitelist_no') {
            interaction.update({content: 'Cancelled.', components: []})
        }
    }
});

rest.put(Routes.applicationCommands(clientId), {body:  commands}).catch(console.log)

client.login(token)