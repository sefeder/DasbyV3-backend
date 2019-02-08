const Chat = require('twilio-chat')

let channelAsDasby;

const twilio = require('../routes/services/twilio')

const getChannelAsDasby = (identity, channelSid) => {

    return getTwilioToken(identity)
        .then(createChatClient)
        .then(chatClient => {
            return chatClient.getChannelBySid(channelSid)
        }).catch(err=>console.log("gettwilioToken and creatChateClient catch: ", err))
}

getTwilioToken = identity => {
    return new Promise((resolve, reject) =>{
        resolve(twilio.generateTwilioJwt(identity))
    })
}

createChatClient = token => {
    return new Promise((resolve, reject) => {
        console.log('token.toJwt(): ', token.toJwt())
        resolve(Chat.Client.create(token.toJwt()))
    })
}


module.exports = {
    getChannelAsDasby: getChannelAsDasby
}