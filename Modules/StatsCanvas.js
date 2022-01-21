const { MessageAttachment } = require('discord.js')
const Canvas = require('canvas')
const { GetStats } = require('./API')
const { HandleError } = require('./ErrorHandler')

async function CreateCanvas(interaction) {
    const canvas = Canvas.createCanvas(750, 250)
    const context = canvas.getContext('2d')
    // Background
    // context.drawImage(await Canvas.loadImage('./Images/Galaxy.jpg'), 0, 0, canvas.width, canvas.height)
    context.fillStyle = '#303030'
    context.fillRect(0, 0, canvas.width, canvas.height)
    // Text
    const startY = 70, fontSize = 30
    context.font = `${fontSize}px sans-serif`
    context.fillStyle = '#ffffff'
    context.fillText('CFCSC MC', canvas.width / 2.75, startY)
    let stats
    try {
        stats = await GetStats()
    }
    catch(e) {
        return e
    }
    if (typeof(stats) == 'string') return stats
    context.fillStyle = stats.status == 'online' ? '#00FF85' : '#FF1B57'
    context.fillText(stats.status.substring(0,1).toUpperCase() + stats.status.substring(1), canvas.width / 2.75, startY + fontSize * 1.5)
    context.fillStyle = '#ffffff'
    context.fillText(`Players ${stats.onlinePlayers}/${stats.maxPlayers}`, canvas.width / 2.75, startY + fontSize * 3)
    context.fillText('mc.vipers.host', canvas.width / 2.75, startY + fontSize * 4.5)
    // Avatar
	context.beginPath()
	context.arc(125, 125, 100, 0, Math.PI * 2, true)
	context.closePath()
	context.clip()
    context.drawImage(await Canvas.loadImage(interaction.client.user.displayAvatarURL({ format: 'jpg' })), 25, 25, 200, 200)
    return new MessageAttachment(canvas.toBuffer())   
}



module.exports = CreateCanvas