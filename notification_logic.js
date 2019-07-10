/************************************************
 Imports 
************************************************/
const notificationModel = require("./models/notifications")
const moment = require("moment")


/************************************************
 Variables
************************************************/
// set cadence in minutes
const cadence = 1

/************************************************
 Exported Functions
************************************************/

shouldNotifyUser = function(userData, lastSurveyData, lastNotificationData){
    
    // Get Data from Function Parameters
    const userName = userData.first_name + " " + userData.last_name;
    const lastCompletedSurveyDate = moment(lastSurveyData.createdAt);

    // Establish Date Variables
    const dateEnrolled = moment(userData.createdAt)
    const currentWeekNumber = Math.floor((moment()-dateEnrolled)/ (1000*60*60*24*7))+1
    const dateLastNotification =  moment(lastNotificationData.createdAt) || null
    const minutesSinceLastNotification = (moment()-dateLastNotification)/(1000*60) || null
    let notifyCount = lastNotificationData.notifyCount
    const lastNotificationWeekNumber = Math.floor((dateLastNotification-dateEnrolled)/ (1000*60*60*24*7))+1 || null

    const dateCurrentWeekSurvey = dateEnrolled.add(currentWeekNumber-1,"weeks").startOf("day")
    const dateNextWeekSurvey = dateEnrolled.add(currentWeekNumber,"weeks").startOf("day")
    
    let isNewWeek
    if (currentWeekNumber > lastNotificationWeekNumber || lastNotificationWeekNumber == null){
        isNewWeek = true
    }else{
        isNewWeek = false
    }

    let hasCompletedCurrentWeekSurvey
    if(lastCompletedSurveyDate >= dateCurrentWeekSurvey){
        hasCompletedCurrentWeekSurvey = true
    }else{
        hasCompletedCurrentWeekSurvey = false
    }

    console.log(userName + " date enrolled: " + dateEnrolled);
    console.log(userName + " is currently on week #" + currentWeekNumber);
    // console.log(userName + " last survey contact: " + dateLastNotification + " (" + parseFloat(Math.round(hoursSinceLastContact * 100) / 100).toFixed(2) + " hours - week #" + lastSurveyWeekNumber + ")");
    // console.log(userName + " last completed survey: " + lastCompletedSurveyDate + " (" + parseFloat(Math.round(hoursToLastCompletedSurvey * 100) / 100).toFixed(2) + " hours)");
    // console.log(userName + " date of this weeks scheduled survey: " + dateOfCurrentSurvey + " (" + parseFloat(Math.round(hoursToNextSurvey/24 * 100) / 100).toFixed(0) + " day(s))");
    // console.log(userName + " date NEXT weeks scheduled survey: " + dateOfNextWeekSurvey + " (" + parseFloat(Math.round(hoursToNextWeeksSurvey/24 * 100) / 100).toFixed(0) + " day(s))");
    
    
    return new Promise((resolve,reject)=>{
        
        // If the user has already been notified three times...
        if(notifyCount >= 3 ){
            if(isNewWeek){
                notifyCount = 0
            }else{
                console.log(userName + " has been notified " + notifyCount + " times already.")
                resolve(false)
            }
        }

        // Otherwise the user has not been notified three times
        // check if they have completed the survey
        if(hasCompletedCurrentWeekSurvey){
            resolve(false)
        }else{
            // check that they have not been notified in the last 24 hours
            if (minutesSinceLastNotification > cadence || minutesSinceLastNotification == null){
                // if today is survey day, set notify count to 1
                if(dateOfCurrentSurvey == moment().startOf("day")) {
                    notifyCount = 1
                } else if (minutesSinceLastNotification==null){
                    notifyCount = 0
                }
                else{
                    notifyCount++
                }
                createNotificationInTable(userData, notifyCount, 0, "Depression Checkin");
                resolve(true, notifyCount);
            }
        }

    })
}

/************************************************
 HELPERS
************************************************/
createNotificationInTable = function(userData, notifyCount,surveType,surveyName){
    notificationModel.create({
        upi: userData.upi,
        surveyType: surveType,
        surveyName: surveyName,
        notifyCount: notifyCount
    })
    .then(console.log("Added notification to table"))
    .catch(err=>console.log("Error adding notification to table: ", err))

}
/************************************************
 Modules 
************************************************/
module.exports = {shouldNotifyUser}
