const fs = require('fs')

function HandleError(res) {
    if (res.startsWith('<!DOCTYPE HTML>')) {
        fs.writeFileSync('/var/www/viper.tools/public_html/error.html', res)
        return 'An error has occured. View the html response from the server here: https://viper.tools/error'
    }
}

module.exports = { HandleError }