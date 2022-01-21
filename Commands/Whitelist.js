const { SlashCommandStringOption } = require('@discordjs/builders')
const { MessageActionRow, MessageButton } = require('discord.js')
const { GetWhitelist } = require('../Modules/Whitelist')
const Command = require('../Modules/Command')

async function Whitelist(interaction) {
    const row = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId('whitelist_yes')
            .setLabel('Yes')
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('whitelist_no')
            .setLabel('No')
            .setStyle('DANGER')
    )
    const old = GetWhitelist(interaction.user.id)
    interaction.reply({ content:  old ? `Are you sure you want to override your old account "${old}" with the account ${interaction.options.getString('minecraft_username')}?` : `Are you sure you want to whitelist the account ${interaction.options.getString('minecraft_username')}?`,  components: [row] })
}

const cmd = new Command('whitelist', 'Whitelists your Minecraft account.', Whitelist)
cmd.data.addStringOption(new SlashCommandStringOption().setName('minecraft_username').setDescription('Your Minecraft username to be added to the server').setRequired(true))

module.exports = cmd