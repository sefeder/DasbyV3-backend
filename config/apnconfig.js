const apn = require('apn')
require('dotenv').config()

const apnProvider = new apn.Provider({
    token:{
        key: "../../Downloads/AuthKey_Y9CWL9QAJ6.p8",
        keyId: 'Y9CWL9QAJ6',
        teamId: '8ZLMF6ASL9'
    },
    production: true
})

sendNotification = function(noteObject, token){
    let note = new apn.Notification();
    note.expiry = noteObject.expiry
    note.badge = noteObject.badge;
    note.alert = noteObject.alert
    note.payload = noteObject.payload
    note.topic = noteObject.topic 
    apnProvider.send(note, token)
    .then((result) => {
        console.log(result)
    })
    .catch(err=>console.log("Error sending notification: ", err));
}


module.exports = {
    // createNotification,
    sendNotification
}