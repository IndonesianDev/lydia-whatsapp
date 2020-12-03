const { LydiaAI } = require('coffeehouse')
const config = require('../config.json')

/**
 * Send response to user from CoffeeHouse.
 * @param {String} text 
 */
module.exports = async function speak(text) {
    const api = new LydiaAI(config.api)
    const session = await api.createSession()
    return session.think_thought(text)
}