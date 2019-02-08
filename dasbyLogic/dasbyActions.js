const twilio = require('./dasbyTwilio')
const virgil = require('./dasbyVirgil')
const dialogue = require('../models/dialogue')
const Users = require('../models/Users')


const sendResponse = (channel, message) => {
    console.log('send response hit!!!')
    channel.sendMessage(virgil.encryptMessage(channel, message))
}

dasbyRead = (channelSid, chapter, section, block) => {
    Users.findOne({ first_name: 'Dasby' })
    .then(dasby => {
        twilio.getChannelAsDasby(dasby.upi, channelSid)
        .then(currentChannel => {
            dialogue.find(chapter, section, block || 0)
            .then(allSectionData => {
                let iteration = 0;
                let currentBlockData = allSectionData[0];
                messageRouter(currentChannel, allSectionData, currentBlockData, iteration);
            }).catch(err => console.log("dialogue.find catch 22: ", err))
        })
    })
}

canParseStr = str => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

handleNewMessage = (channelSid, body, author) => {
    Users.findOne({ first_name: 'Dasby' })
    .then(dasby => {
        if (author !== dasby.upi ) {
            twilio.getChannelAsDasby(dasby.upi, channelSid)
            .then(currentChannel =>{
                console.log("handleNewMessage currentChannel: ", currentChannel)
                const decryptedMessageString = virgil.decryptMessage(currentChannel, body, dasby.private_key, dasby.upi)
                console.log('decryptedMessageString: ', decryptedMessageString)
                // parse decryptedMessage for chapter, section, and block and pass in to sendResponse
                // the below case will only be false if the user types a free response message (not a json object)
                if (canParseStr(decryptedMessageString)) {
                    const decryptedMessage = JSON.parse(decryptedMessageString)
                    //NEED TO ASK JONNY: why do some rows have a payload without a block? thats why we added the bottom
                    if (decryptedMessage.chapter !== 'Survey') {
                        dialogue.find(decryptedMessage.chapter, decryptedMessage.section, decryptedMessage.block || 0).then(allSectionData => {
                            let iteration = 0;
                            let currentBlockData = allSectionData[0];
                            messageRouter(currentChannel, allSectionData, currentBlockData, iteration);
                        }).catch(err => console.log("dialogue.find catch: ",err))
                    }
                } else {
                    // sendResponse(currentChannel, 'Sorry, I\'m not taking free response answers at this time');
                }
                
            }).catch(err=>console.log("getChannelAsDasby catch",err))
        }
    })
}

messageRouter = (channel, allSectionData, currentBlockData, iteration) => {

    console.log("Running through chapterData")

    if (!currentBlockData) {
        return;
    }
    const payloadType = currentBlockData.payloadType;
    let delay = 1000;

    if (currentBlockData.typeDelay) {
        delay = Math.round(Number(currentBlockData.typeDelay * 2000));
    }

    switch (payloadType) {
        case 0: // Plain text
            console.log("In case 0, PLAIN TEXT")
            
            iteration++;
            
            // Show typing indicator.
            channel.typing()
                // In order to have a small delay between messages, we need to set a timeout.
            setTimeout(() => {
                sendResponse(channel, currentBlockData.payloadData);
                if (iteration < allSectionData.length) {
                    messageRouter(channel, allSectionData, allSectionData[iteration], iteration);
                }
            }, delay);
                
            break;

        case 1: // Quick-replies
            channel.typing()
            // In order to have a small delay between messages, we need to set a timeout.
            setTimeout(() => {
                sendResponse(channel, currentBlockData.payloadData);
            }, delay);

            break;

        case 2: //Images

            // var imageURL = payloadData.imageURL;
            iteration++;
            // var messagePayload = {
            //     attachment: {
            //         type: "image",
            //         payload: {
            //             url: imageURL
            //         }
            //     }
            // };

            channel.typing()
            // In order to have a small delay between messages, we need to set a timeout.
            setTimeout(() => {
                sendResponse(channel, currentBlockData.payloadData);
                if (iteration < allSectionData.length) {
                    messageRouter(channel, allSectionData, allSectionData[iteration], iteration);
                }
            }, delay);

            break;

        case 3: // Video

            var videoURL = payloadData.videoURL;
            iteration++;
            var messagePayload = {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "open_graph",
                        elements: [
                            {
                                url: videoURL
                            }
                        ]
                    }
                }
            };

            channel.typing()
            // In order to have a small delay between messages, we need to set a timeout.
            setTimeout(() => {
                sendResponse(channel, 'this will be a video');
                if (iteration < allSectionData.length) {
                    messageRouter(channel, allSectionData, allSectionData[iteration], iteration);
                }
            }, delay);

            break;

        case 4: // Generic Template
            iteration++;

            channel.typing()
            // In order to have a small delay between messages, we need to set a timeout.
            setTimeout(() => {
                sendResponse(channel, 'this will be a generic template');
                if (iteration < allSectionData.length) {
                    messageRouter(channel, allSectionData, allSectionData[iteration], iteration);
                }
            }, delay);

            break;

        // case 5: // Modules
        //     console.log("Attempting to run module with payload: ");
        //     console.log(payloadData);

        //     if (message) {
        //         // Send FB message
        //         FB.sendMessage(sender, message, null);
        //     }

        //     var moduleName = payloadData.module;
        //     console.log("Module Named: ");
        //     console.log(moduleName);

        //     if (moduleName == "resultsModule") {
        //         resultsModule.displayResults(sender);
        //     }

        //     const suicideInterventionModule = require("./dasby_modules/suicideInterventionModule");
        //     if (moduleName == "suicideInterventionModule") {
        //         var action = payloadData.action;
        //         suicideInterventionModule.takeAction(sender, action);

        //     }

        //     break;

        default:
            break;
    }

}

module.exports = {
    handleNewMessage: handleNewMessage,
    dasbyRead: dasbyRead
}