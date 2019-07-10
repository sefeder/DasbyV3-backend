//To be run directly from Heroku Scheduler
//
console.log('Running Notification Scheduler');

/************************************************
 Imports 
************************************************/
const userModel = require("./models/Users")
const resultModel = require("./models/results")
const notificationModel = require("./models/notifications")
const notificationLogic = require ("./notification_logic")
const apnNotifcation = require ("./config/apnconfig")
// const key = "../../Downloads/AuthKey_Y9CWL9QAJ6.p8",

/************************************************
 Variables
************************************************/
let allUserData = [];
let allUserNotificationMap = {};
let usersMap = {};
/************************************************
 Exiting or Breaking 
************************************************/
setTimeout(function(){
    // this code will only run when time has ellapsed
    process.exit();
}, 20000);

let date = new Date();
let hour = date.getHours();
console.log("hour: ");
console.log(hour);

//Only run this script at certain times
// if (isEven(hour) && (hour >= 14 || hour <= 4) ) {
//   console.log('--STARTING SYMPTOM CHECKIN SCHEDULER--');
//   start();
// }
// else{
//   console.log("--EXITING SYMPTOM CHECKIN SCHEDULER--");
//   process.exit();
// }
start()
/************************************************
 // STEP 1: Get all users + notifications in arrays 
************************************************/
function start() {
    console.log('************************************************');
    console.log('STEP 1: Get all users + notifications in arrays');
    console.log('************************************************');
      userModel.findAll().then(dbUsers=>{
        dbUsers.forEach( user => {
      
            //   // Return if user has ended their study
            //   var finishDate = new Date(user.finishDate);
            //   var now = new Date();
            //   if (user.finishDate != null && now > finishDate) { return; }

            var userUpi= user.upi;
            var userName = user.first_name + " " + user.last_name;
            allUserData.push(user);
            usersMap[userUpi] = userName;
        })

        console.log("Number of users to process: " + allUserData.length + ".");
        
        // Get user notification data
        for(let i=0; i < allUserData.length; i++){
            console.log("hitting for loop in step 1")
            let user = allUserData[i]
            notificationModel.findOne(user.upi,0)
            .then(notification => {
              console.log("notification: ", notification)
                allUserNotificationMap[user.upi] = notification;
                // Move to step #2
                if (i == allUserData.length-1) { checkForSurveyCompletion(); };
            }).catch(err=>console.log("error in notificationModel.findOne: ", err))
        }
      })
  
}
  
  /************************************************
   // STEP 2: For each user, find whether they
   // completed a survey for this week or not
  ************************************************/
    function checkForSurveyCompletion(){
        console.log('************************************************');
        console.log('STEP 2: For each user, find whether they completed a survey for this week or not');
        console.log('************************************************');
    
        allUserData.forEach( user => {
            let userUpi = user.upi;
            let push_token = user.push_token
            console.log("push_token: ", push_token)
            scheduleCorrectNotification(userUpi, push_token,1)
            // resultModel.findOne(userUpi, 'Depression').then(lastCompletedSurveyData => {
            //     notificationLogic.shouldNotifyUser(user, lastCompletedSurveyData, allUserNotificationMap[userUpi])
            //       .then((shouldNotifyBool, notifyCount)=>{
            //         if (shouldNotifyBool) {
            //           //Step 3: Notify user
            //           scheduleCorrectNotification(userUpi, push_token, notifyCount);
            //         }
            //         else{
            //           console.log("Don't notify user " + usersMap[userUpi] + " for survey");
            //         }
            //       })
            // })
        });
    }
  
  /************************************************
   // STEP 3: Notify the user for new survey
  ************************************************/
  function scheduleCorrectNotification(userUpi, push_token, notifyCount){

    if (push_token){
      console.log('************************************************');
      console.log('STEP 3: Notify the user for new survey');
      console.log('************************************************');
      console.log("Notified " + usersMap[userUpi] + " at " + new Date() + " for survey");
      
      let note = {}
      // note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
      note.badge = 1;
      note.payload = { 'messageFrom': 'Dasby' };
      note.topic = "org.reactjs.native.dasbytest";
      
      switch (notifyCount) {
        case 1:
          note.alert = "Do you have a minute to take this week's survey?";
          apnNotifcation.sendNotification(note, push_token)
        break;
    
        case 2:
          note.alert = "You missed your survey yesterday. Do you have time right now?";
          apnNotifcation.sendNotification(note, push_token)
        break;
    
        case 3:
          note.alert = "Hey, you've missed a couple of days. Would now be a good time to check in?";
          apnNotifcation.sendNotification(note, push_token)
        break;
    
        default:
          note.alert = "Do you have a minute to take this week's survey?";
          apnNotifcation.sendNotification(note, push_token)
        break;
      }
    } else {
      console.log('Could not find push token for ' + usersMap[userUpi])
      return;
    }
  }


/************************************************
 // HELPERS
************************************************/
function isEven(n) {
    return n % 2 == 0;
 }