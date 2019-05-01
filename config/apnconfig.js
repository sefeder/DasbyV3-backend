let apn = require('apn')

let provider = new apn.Provider({
    token:{
        key: "../../../Downloads/AuthKey_HL4HFW484R.p8",
        keyId: "HL4HFW484R",
        teamId: "8ZLMF6ASL9"
    },
    production: false
})