const crypto = require('crypto')
const https = require('https')
const { userEmail, apiKey, serverId } = process.env
const options = {
    host: 'panel.pebblehost.com',
    path: '/api.php',
    port: 443,
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0',
        'Referer': 'https://panel.pebblehost.com'
    }
}
const { HandleError } = require('./ErrorHandler')

async function Request(method, data = {}) {
    data['_MulticraftAPIMethod'] = method
    data['_MulticraftAPIUser'] = userEmail
    let str = ''
    for (key in data) str += key + data[key]
    const hmac = crypto.createHmac('sha256', apiKey)
    hmac.update(str)
    data['_MulticraftAPIKey'] = hmac.digest('hex')
    let params = ''
    for (key in data) params += key + '=' + data[key] + '&'
    params = params.substring(0, params.length - 1)
    
    return new Promise((resolve, reject) => {
        const req = https.request(options, res => {
            const chunks = []
            res.on('data', data => {
                if (typeof(data) === 'string' && data.toString().startsWith('<!DOCTYPE HTML>')) {
                    reject(HandleError(data))
                }
                chunks.push(data)
            })
            res.on('end', () => {
                resolve(chunks.join(''))
            })
        })
        req.on('error', (e) => reject(e))
        req.write(params)
        req.end()
    })
}

async function GetStats() {
    let res = (await Request('getServerStatus', {id: serverId, name: 'player_list', default: '0'})).toString()
    try {
        res = JSON.parse(res)
        return res.data
    }
    catch {
        return res
    }
}

function SendCommand(command) {
    return Request('sendConsoleCommand', {server_id: serverId, command})
}

const ip = 'cscsmp.my.pebble.host'
const playersOptions = {
    host: 'api.mcsrvstat.us',
    path: `/2/${ip}`,
    port: 443,
    method: 'GET'
}

async function GetPlayers() {
    return new Promise((resolve, reject) => {
        const req = https.request(playersOptions, res => {
            const chunks = []
            res.on('data', data => {
                chunks.push(data)
            })
            res.on('end', () => {
                try {
                    const json = JSON.parse(chunks.join(''))
                    resolve(json.players)
                }
                catch (e) {
                    reject(e)
                }
            })
        })
        req.on('error', (e) => reject(e))
        req.end()
    })
}

module.exports = { Request, SendCommand, GetStats, GetPlayers }