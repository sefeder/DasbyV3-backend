const apn = require('apn')

const apnProvider = new apn.Provider({
    token:{
        key: "../../../Downloads/AuthKey_HL4HFW484R.p8",
        keyId: "HL4HFW484R",
        teamId: "8ZLMF6ASL9"
    },
    production: false
})

createNotification = function(noteObject){
    let note = new apn.Notification();
    note.expiry = noteObject.expiry
    note.badge = noteObject.badge;
    note.alert = noteObject.alert 
    note.payload = noteObject.payload 
    note.topic = noteObject.topic
    return note   
}


sendNotification = function(note, token){
    apnProvider.send(note, token)
    .then((result) => {
        console.log(result)
    })
    .catch(err=>console.log("Error sending notification: ", err));
}


module.exports = {
    createNotification,
    sendNotification
}