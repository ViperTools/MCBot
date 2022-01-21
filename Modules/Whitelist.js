const { SendCommand } = require('./API')
const fs = require('fs')
const config = readConfig()

function readConfig() {
    return JSON.parse(fs.readFileSync('./Config.json', 'ascii'))
}

function writeConfig() {
    fs.writeFileSync('./Config.json', JSON.stringify(config, null, 4))
}

function GetWhitelist(id) {
    return config.Whitelisted[id]
}

async function Whitelist(id, username) {
    config.Whitelisted[id] = username
    writeConfig()
    return SendCommand(`whitelist add ${username}`)
}

async function Blacklist(id) {
    if (config.Whitelisted[id]) {
        await SendCommand(`whitelist remove ${config.Whitelisted[id]}`)
        delete config.Whitelisted[id]
    }
}

module.exports = {GetWhitelist, Whitelist, Blacklist,}