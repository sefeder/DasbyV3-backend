/************************************************
 Imports 
************************************************/
const DasbyActions = require('./dasbyActions');
const dbUsers = require('../models/Users');
const twilio = require('../routes/services/twilio');

// Item map = { id : [answer thresholds] }
const itemMap = {
    251: [4, 5],
    379: [2],
    380: [3, 4, 5],
    381: [1, 2, 3],
    382: [3, 4, 5],
    383: [3, 4],
    384: [3, 4],
    385: [1],
    386: [3, 4, 5],
    387: [3, 4],
    388: [2],
    389: [2, 3, 4, 5]
}

/************************************************
 Functions (Public)
************************************************/

// After a question is answered, check if it is a suicide question - and if so, compare the thresholds for them. 
//If it was answered at or above the threshold for the particular question, trigger the suicide prevention protocol
suicideCheck = (currentQuestion, choice, userUpi) => {

    console.log("Running Suicide Trigger Protocol: ");

    // Step 4: compare the answer given with the treshold value. If the treshold is met, 
    // start the sucide protocol
        const questionId = currentQuestion.questionID;
        const thresholds = itemMap[questionId];
        if (questionId in itemMap) {
            if (thresholds.indexOf(choice) > -1) {
                // Start protocol
                takeAction(userUpi, "warn");
                // suicidePreventionProtocol(userUpi);
            }
        }
}

// NEED TO REFACTOR THIS TO PROPERLY PROMPT DASBY SCRIPT
// ALSO, ONLY WANT THIS TO BE TRIGGERED ONCE PER SURVEY
// var suicidePreventionProtocol = function (sender) {
//     twilio.findChannel(chatClient, this.state.userInfo.upi)
//         .then(channel => {
//             DasbyActions.read(channel.sid, "Suicide Protocol", 0, 0)
//         })
// }

/************************************************
 Functions (Private)
************************************************/
takeAction = (userUpi, action) => {
    let body
    switch (action) {
        case "warn":
            body = "has been thinking about suicide lately. \nNo immediate actions necessary.";
            contactPI(userUpi, body);
            break;
        case "call_now":
            body = "needs your assistance. \n**PLEASE CALL IMMEDIATELY**";
            contactPI(userUpi, body);
            break;
        case "follow_up":
            body = "needs you to follow up tomorrow.";
            contactPI(userUpi, body);
            break;
    }
} 

contactPI = (userUpi, body) => {
    console.log("CONTACTING PI");
    dbUsers.findOne({ upi: userUpi })
        .then(user => {
            const message = `${user.first_name} ${user.last_name} ${body}`
            twilio.sendSMS(message)
        })
}

/************************************************
 Modules 
************************************************/
module.exports = {
    suicideCheck: suicideCheck
}