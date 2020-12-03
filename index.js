const { create, Client } = require('@open-wa/wa-automate')
const { color, options } = require('./utils')
const msgHandler = require('./handlers')

async function start(client = new Client()) {
    console.log('[LYDIA]', color('Lydia is now ready!'))

    // Force to keep the current session
    client.onStateChanged((state) => {
        console.log('[LYDIA STATE]', state)
        if (state === 'UNPAIRED') client.forceRefocus()
        if (state === 'CONFLICT') client.forceRefocus()
        if (state === 'UNLAUNCHED') client.forceRefocus()
    })

    // Set all received messages to seen
    client.onAck((x) => {
        const { to } = x
        if (x !== 3) client.sendSeen(to)
    })

    // Listening to incoming messages
    client.onMessage((message) => {
        client.getAmountOfLoadedMessages()
            .then((msg) => {
                if (msg >= 3000) {
                    console.log('[LYDIA]', color(`Message cache reached ${msg}, deleting message cache...`, 'yellow'))
                    client.cutMsgCache()
                        .then(() => console.log('[LYDIA]', color('Cache deleted.', 'yellow')))
                }
            })
        // Message handler
        msgHandler(client, message)
    })

    // Detect incoming calls and block the person
    client.onIncomingCall(async (callData) => {
        await client.sendText(callData.peerJid, 'I don\'t receiving *ANY* calls.\nYou have been blocked because breaking the rules.')
        await client.contactBlock(callData.peerJid)
            .then(() => {
                console.log(color('[BLOCK]', 'red'), color(`${callData.peerJid} has been blocked. Reason:`, 'yellow'), color('CALLING THE BOT', 'cyan'))
            })
    })
}

// Creating the session
create(options(start))
    .then((client) => start(client))
    .catch((err) => new Error(err))
