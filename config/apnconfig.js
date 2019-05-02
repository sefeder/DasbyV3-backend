const apn = require('apn')

const apnProvider = new apn.Provider({
    token:{
        key: "../../../Downloads/AuthKey_HL4HFW484R.p8",
        keyId: "HL4HFW484R",
        teamId: "8ZLMF6ASL9"
    },
    production: false
})

let note = new apn.Notification();

note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
note.badge = 3;
note.sound = "ping.aiff";
note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
note.payload = { 'messageFrom': 'John Appleseed' };
note.topic = "org.reactjs.native.dasbytest";

apnProvider.send(note, '25b9beec6f31aa16997977c1b65e2c8465bb23af6088cb5793154588f5553993').then((result) => {
    console.log(result)
});


module.exports = {
    apnProvider
}