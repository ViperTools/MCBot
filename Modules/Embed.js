const {embedColor, errorColor} = process.env
const { MessageEmbed } = require('discord.js')

function getTime() {
    let date = new Date();
    let utc = date.getTime() + date.getTimezoneOffset() * 60000
    let offset = 5
    return new Date(utc + (3600000 * -offset)).toLocaleString().replace(',',' •').split('').reverse().join('').replace(/\d{2}:/,'').split('').reverse().join('')
}

class embed {
    constructor(color,title,description) {
        if (color && !color.startsWith('#')) {
            description = title
            title = color
            color = embedColor
        }
        const newEmbed = new MessageEmbed().setColor(color)
        if (title && !description) {
            newEmbed.setDescription(title)
        }
        else if (title && description) {
            newEmbed.setTitle(title)
            newEmbed.setDescription(description)
        }
        const date = new Date()
        return newEmbed.setFooter(`Clown Detector • ${getTime()} CST`, 'https://cdn.discordapp.com/avatars/862075358035312690/e5ae47f76b52507b601050ad76d450fc.png?size=256')
    }
}

class error {
    constructor(error) {
        const date = new Date()
        return new MessageEmbed().setColor(errorColor).setTitle('Error').setDescription('```\n' + error + '```').setFooter(`Clown Detector • ${getTime()} CST`, 'https://cdn.discordapp.com/avatars/862075358035312690/e5ae47f76b52507b601050ad76d450fc.png?size=256')
    }
}

module.exports = {embed, error}