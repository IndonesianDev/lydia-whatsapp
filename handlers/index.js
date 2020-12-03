const { Client } = require('@open-wa/wa-automate')
const { color } = require('../utils')
const speak = require('../libs/lydia')
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')

module.exports = async function msgHandler(client = new Client(), message) {
    try {
        const { id, from, t, sender, chat, quotedMsg, quotedMsgObj, isGroupMsg } = message
        let { body } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName } = sender
        pushname = pushname || verifiedName
        const args = body.trim().split(/ +/)
        const isCalled = args.includes('Lydia')

        if ((quotedMsg && quotedMsgObj.fromMe || isCalled) && isGroupMsg) console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Chat [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle))
        if ((quotedMsg && quotedMsgObj.fromMe || isCalled) && !isGroupMsg) console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Chat [${args.length}]`), 'from', color(pushname))

        if (quotedMsg && quotedMsgObj.fromMe) {
            client.simulateTyping(from, true)
            speak(args)
                .then(async (data) => {
                    await client.reply(from, data.data.payload.output, id)
                })
                .catch(async (err) => {
                    console.error(err)
                    await client.sendText(from, err)
                })
        } else if (isCalled) {
            client.simulateTyping(from, true)
            speak(args)
                .then(async (data) => {
                    await client.reply(from, data.data.payload.output, id)
                })
                .catch(async (err) => {
                    console.error(err)
                    await client.sendText(from, err)
                })
        }
    } catch (err) {
        console.error(color('[ERROR]', 'red'), err)
    }
}