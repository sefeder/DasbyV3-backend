const apn = require('apn')
require('dotenv').config()

const apnProvider = new apn.Provider({
    token: {
        key: "../AuthKey_Y9CWL9QAJ6.p8",
        keyId: 'Y9CWL9QAJ6',
        teamId: '8ZLMF6ASL9'
    },
    production: false
})




sendNotification = function (noteObject, token) {
    let note = new apn.Notification();
    // note.expiry = noteObject.expiry
    note.badge = noteObject.badge;
    note.alert = noteObject.alert
    note.payload = noteObject.payload
    note.topic = noteObject.topic
    
    apnProvider.send(note, token)
        .then((result) => {
            console.log(result)
            process.exit()
        })
        .catch(err => console.log("Error sending notification: ", err));
}

// let noteObject = {};
// noteObject.alert = 'Hello Boizzzzz'
// noteObject.badge = 1;
// noteObject.payload = { 'messageFrom': 'Dasby' };
// noteObject.topic = "org.reactjs.native.dasbytest";
// sendNotification(noteObject, "25b9beec6f31aa16997977c1b65e2c8465bb23af6088cb5793154588f5553993")


module.exports = {
    // createNotification,
    sendNotification
}