//To be run directly from Heroku Scheduler
//
console.log('Running Notification Scheduler');

/************************************************
 Imports 
************************************************/
const userModel = require("./models/Users")
const resultModel = require("./models/results")
const notificationModel = require("./models/notifications")


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
if (isEven(hour) && (hour >= 14 || hour <= 4) ) {
  console.log('--STARTING SYMPTOM CHECKIN SCHEDULER--');
  start();
}
else{
  console.log("--EXITING SYMPTOM CHECKIN SCHEDULER--");
  process.exit();
}

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
            let user = allUserData[i]
            notificationModel.findOne(user.upi,0).then(notification => {
                allUserNotificationMap[user.upi] = notification;
                // Move to step #2
                if (i == allUserData.length) { checkForSurveyCompletion(); };
            })
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
            userModel.findOne(userUpi, 'Depression').then(dbResult => {
                schedulerLogic.shouldNotifyUserWithEnrollmentDateLogic(user, dbResult, allUserNotificationMap[userUpi], function(shouldNotifyBool, notifyCount){

                    if (shouldNotifyBool) {
                    //Step 3: Notify user
                    stepThree(userUpi, notifyCount);

                    }
                    else{
                    console.log("Don't notify user " + usersMap[userUpi] + " for survey");
                    }
                });
            })
        });
    }
  
  /************************************************
   // STEP 3: Notify the user for new survey
  ************************************************/
  function stepThree(userUpi, notifyCount){
  
    console.log('************************************************');
    console.log('STEP 3: Notify the user for new survey');
    console.log('************************************************');
    console.log("Notified " + usersMap[userUpi] + " at " + new Date() + " for survey");
  
    switch (notifyCount) {
      case 1:
        DasbyActions.read("Notifications", 0, 0, userUpi);
      break;
  
      case 2:
        DasbyActions.read("Notifications", 0, 1, userUpi);
      break;
  
      case 3:
        DasbyActions.read("Notifications", 0, 2, userUpi);
      break;
  
      default:
        DasbyActions.read("Notifications", 0, 0, userUpi);
      break;
    }
    
  }


/************************************************
 // HELPERS
************************************************/
function isEven(n) {
    return n % 2 == 0;
 }