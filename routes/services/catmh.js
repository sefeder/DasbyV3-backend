/************************************************
 Imports 
************************************************/
const request = require("request");
const bodyParser = require("body-parser");
const Results = require("../../models/results")
// var Interview = require("../models/interview");
// var Result = require("../models/result");
// var DasbyActions = require('../dasbyActions')
const suicideInterventionModule = require("../../dasbyLogic/suicideInterventionModule");

/************************************************
 Init 
************************************************/
request.defaults({
    jar: true
});

/************************************************
 Modules 
************************************************/
module.exports = {

    /************************************************
    Creating Interviews
    ************************************************/
    getSurvey: (surveyType, userUpi) => {
       return new Promise ((resolve, reject) => {
           // STEP 1. Create Interview:
           createInterview(userUpi, surveyType)
           .then(keysJSON => {
               // STEP 2. Get cookies for interview
               getCookies(userUpi, keysJSON)
               // .then(cookies=>{
               //     // STEP 3. Update cookies (send to mlab)
               //     updateCookies(userUpi, cookies);
               // })
               .then(cookies => {
                   // STEP 4. Start interview / get first item
                   getItem(cookies)
                   .then(item => {
                       const itemJSON = JSON.parse(item)
                       const newItem = {...itemJSON, cookies: cookies}
                       console.log("newItem", newItem);
                       resolve(newItem)
                   })
               })
           })
       })
    },

    /************************************************
    Next Item
    ************************************************/
    nextItem: (userUpi, choice, currentQuestion) => {
        return new Promise((resolve, reject)=>{

            // Cookies from currentQuestion
            const cookies = {
                AWSELB: currentQuestion.cookies.AWSELB,
                JSESSIONID: currentQuestion.cookies.JSESSIONID
            };
    
            // Step 1. Send Answer Choice
            
            // check for suicide trigger
            suicideInterventionModule.suicideCheck(currentQuestion, choice, userUpi)

            // continue sending response
            sendAnswers(cookies, currentQuestion.questionID, choice)
            .then(body => {
                console.log(body)
                // Step 2. Get next item
                getItem(cookies) 
                .then(item => {
                    console.log("ITEM: ", item);
                    // STEP 3. Item message
                    const itemJSON = JSON.parse(item);
                    console.log("QuestionId: ", itemJSON.questionID);
                    if (itemJSON.questionID === -1 || itemJSON.questionID === "-1") {
                        
                         console.log("Thank you, the interview has been completed.")
                        
                       
                        // completedInterview(userUpi, function () {
            
                            // Save Results
                            saveResults(userUpi, currentQuestion)
                            .then( results => {
                                // Save results in database
                                Results.create(results)
                                resolve({
                                    surveyIsDone: true,
                                    results: results
                                })
                            })
                       // });
                    } else {
                        const newItem = { ...itemJSON, cookies: cookies }
                        resolve(newItem)
                    }
                })
            })
        })
    }

    

    /************************************************
    Get Results
    ************************************************/
//     getResults: function (userUpi, sendMessage) {

//         // Find Results

//         Result.findOne(userUpi, 'Depression', function (error, results) {
//             if (error) {
//                 console.log('Error on getResults for Interview!');
//                 console.log(error);

//                 sendMessage({
//                     text: error
//                 });

//             } else {
//                 console.log('getResults Completed...');
//                 console.log(results);

//                 var responseJSON = results;
//                 var interviewId = responseJSON.interviewId;
//                 var testLabel = responseJSON.testType;
//                 var diagnosis = responseJSON.diagnosis;
//                 var confidence = responseJSON.confidence;

//                 sendMessage({
//                     text: "Test: " + testLabel + " (id " + interviewId + ")\nDiagnosis: " + diagnosis + "\nConfidence: " + confidence + "%"
//                 });

//             }
//         });

//     }

};

/************************************************
 Functions (Helpers)
************************************************/
// function getItemMessage(cookies, item, callback) {

//     var itemJSON = JSON.parse(item);

//     // Get item text
//     var itemText = itemJSON.questionNumber + ". " + itemJSON.questionDescription + "\n";
//     var questionId = itemJSON.questionID;

//     // Get answer choices + create quick replies
//     var answerChoicesArray = itemJSON.questionAnswers;
//     var quickReplies = [];

//     for (i = 0; i < answerChoicesArray.length; ++i) {
//         //Generate Item Text
//         itemText = itemText + (i + 1) + ". " + answerChoicesArray[i].answerDescription + "\n";
//         var answer = (i + 1) + ". " + answerChoicesArray[i].answerDescription;

//         //Generate Payload
//         var payload = JSON.stringify({
//             questionID: questionId,
//             AWSELB: cookies.AWSELB,
//             JSESSIONID: cookies.JSESSIONID,
//             question: itemJSON.questionNumber + ". " + itemJSON.questionDescription,
//             answer: answer,
//             choice: i + 1
//         });

//         //Quickreply
//         quickReplies.push({
//             content_type: "text",
//             title: (i + 1),
//             payload: payload
//         });
//     }

//     var quickMessage = {
//         text: itemText,
//         quick_replies: quickReplies
//     };

//     // Ceate message array
//     var messageArray = quickMessage;
//     callback(messageArray);

// }

/************************************************
 Functions (Network)
************************************************/
sendAnswers = (cookies, questionId, response) => {
    return new Promise((resolve, reject) => {
        
        const url = "https://www.cat-mh.com/interview/rest/interview/test/question";
    
        const j = request.jar();
        const jsessionCookie = request.cookie("JSESSIONID=" + cookies.JSESSIONID);
        const awselbCookie = request.cookie("AWSELB=" + cookies.AWSELB);
        j.setCookie(jsessionCookie, url);
        j.setCookie(awselbCookie, url);
    
        const seconds = new Date().getTime() / 1000;
        const parameters = JSON.stringify({
            "questionID": questionId,
            "response": response,
            "duration": seconds,
            "curT1": 0,
            "curT2": 0,
            "curT3": 0
        });
    
        request.post({
            url: url,
            headers: {
                'content-type': 'application/json;charset=utf-8',
                "accept": "application/json",
                "JSESSIONID": cookies.JSESSIONID,
                "AWSELB": cookies.AWSELB
            },
            body: parameters,
            jar: j
        }, function (error, response, body) {
    
            if (error) {
                console.log(error);
    
            } else {
                console.log("ANSWER SENT DATA: ");
                // console.log(response.headers);
                // console.log(response);
                // console.log(body);
                resolve(body);
            }
        });
    })
}

getItem = (cookies, callback) => {
    return new Promise((resolve, reject) => {

        const url = "https://www.cat-mh.com/interview/rest/interview/test/question";
    
        const j = request.jar();
        const jsessionCookie = request.cookie("JSESSIONID=" + cookies.JSESSIONID);
        const awselbCookie = request.cookie("AWSELB=" + cookies.AWSELB);
        j.setCookie(jsessionCookie, url);
        j.setCookie(awselbCookie, url);
    
        request.get({
            headers: {
                'content-type': 'application/json;charset=utf-8',
                "accept": "application/json"
            },
            url: url,
            jar: j
        }, function (error, response, body) {
    
            // console.log("ITEM RESPONSE HEADER: ");
            // console.log(response.headers);
    
            if (error) {
                console.log(error);
    
            } else {
                resolve(body);
            }
        });
    })
}

// function updateCookies(userUpi, cookies) {

//     Interview.findOneAndUpdate(userUpi, cookies.JSESSIONID, cookies.AWSELB, null, function (error, results) {
//         if (error) {
//             console.log('Error on findAndUpdate!');
//             console.log(error);
//         } else {
//             console.log('findAndUpdate Complete...');
//             // console.log(results);
//         }
//     });
// }

// function completedInterview(userUpi, completion) {

//     // Find and update
//     Interview.findOneAndUpdate(userUpi, null, null, true, function (error, results) {
//         if (error) {
//             console.log('Error on findAndUpdate!');
//             console.log(error);
//         } else {
//             console.log('findAndUpdate Complete...');
//             // console.log(results);
//             completion();
//         }
//     });
// }

getCookies = (userUpi, keysJSON) => {
    return new Promise((resolve, reject)=>{
        
        const interviewid = keysJSON.interviews[0].interviewID;
        const identifier = keysJSON.interviews[0].identifier;
        const signature = keysJSON.interviews[0].signature;
    
        const url = "https://www.cat-mh.com/interview/signin";
        // console.log("Getting cookies from: ");
        // console.log(url);
        const j = request.jar();
    
        request.post({
            url: url,
            qs: {
                "j_username": identifier,
                "j_password": signature,
                "interviewID": interviewid
            },
            jar: j
        }, (error, response, body) => {
    
            if (error) {
                console.log('error getting cookies: ', error);
    
            } else {
                // console.log("RESPONSE: ");
                // console.log(response);
    
                // console.log("COOKIE JAR: ");
                // console.log(response.headers);
    
    
                // console.log(" -----------  ");
                const cookie_string = j.getCookieString(url); // "key1=value1; key2=value2; ..."
                const cookies = j.getCookies(url);
                const cookiesArray = cookie_string.split('; ').sort();
                const cookiesDict = {
                    AWSELB: cookiesArray[0].split('=')[1],
                    JSESSIONID: cookiesArray[1].split('=')[1]
                };
                // console.log(cookiesArray);
                // console.log("AWSELB: " + cookiesArray[0].split('=')[1]);
                // console.log("JSESSIONID: " + cookiesArray[1].split('=')[1]);
    
    
                // console.log("COOKIES BODY: ");
                // console.log(body);
    
                resolve(cookiesDict);
            }
        });
    
        // var url = "http://qualiahealth.com/dasby/getcookies.php?j_username=" + identifier + "&j_password=" + signature + "&interviewID=" + interviewid;
    
        // request.get({
        //   url: url
        // }, function(error, response, body) {
    
        //   if (error) {
        //     callback(error);
    
        //   } else {
    
        //     console.log(" -----------  ");
        //     var cookiesArray = JSON.parse(body);
        //     console.log(cookiesArray);
        //     console.log("AWSEBS: " + cookiesArray.AWSELB);
        //     console.log("JSESSIONID: " + cookiesArray.JSESSIONID);
    
    
        //     console.log("COOKIES BODY: ");
        //     console.log(body);
    
        //     callback(null, cookiesArray);
        //   }
    
        // });
    })

}

createInterview = (userUpi, surveyType) => {
    return new Promise((resolve, reject) => {
        //vars
        const url = "https://www.cat-mh.com/portal/secure/interview/createInterview";

        const parameters = JSON.stringify({
            "organizationID": 81,
            "userFirstName": "Automated",
            "userLastName": "Creation",
            "subjectID": userUpi,
            "numberOfInterviews": 1,
            "language": 1,
            "tests": [{
                "type": surveyType
            }]
        });

        request.post({
            headers: {
                'content-type': 'application/json;charset=utf-8',
                "accept": "application/json",
                "applicationid": "QH_Portal"
            },
            url: url,
            body: parameters
        }, (error, response, body) => {

            if (error) {
                console.log(error);

            } else {

                const responseBody = JSON.parse(body);
                console.log(responseBody);
                resolve(responseBody)

                // console.log("Creating newInterview model");

                // const newInterview = new Interview({
                //     userId: userUpi,
                //     interviewId: responseBody.interviews[0].interviewID,
                //     identifier: responseBody.interviews[0].identifier,
                //     signature: responseBody.interviews[0].signature,
                //     jsessionId: "",
                //     awselb: "",
                //     testType: surveyType,
                //     completed: false
                // });

                // console.log("Saving newInterview model: ", newInterview);

                // newInterview.save(function (err) {
                //     if (err) {
                //         console.log('Error on save!: ', err);
                //     } else {
                //         console.log('newInterview model save successful');
                //         resolve(responseBody);
                //     }
                // });
            }
        });
    })
}

//FOR BELOW FUNCTION: DON'T NEED PAYLOAD, CURRENT QUESTION HAS COOKIES ON IT

function saveResults(userUpi, currentQuestion) {
    return new Promise((resolve, reject) => {
        // Cookies from currentQuestion
        const cookies = {
            AWSELB: currentQuestion.cookies.AWSELB,
            JSESSIONID: currentQuestion.cookies.JSESSIONID
        };

        //Step 1: Get results from Cat-MH
        const url = "https://www.cat-mh.com/interview/rest/interview/results";

        const j = request.jar();
        const jsessionCookie = request.cookie("JSESSIONID=" + cookies.JSESSIONID);
        const awselbCookie = request.cookie("AWSELB=" + cookies.AWSELB);
        j.setCookie(jsessionCookie, url);
        j.setCookie(awselbCookie, url);

        request.get({
            headers: {
                'content-type': 'application/json;charset=utf-8',
                "accept": "application/json"
            },
            url: url,
            jar: j
        }, function (error, response, body) {

            // console.log("ITEM RESPONSE HEADER: ");
            // console.log(response.headers);

            if (error) {
                console.log(error);
            }
            else {
                if (body) {
                    //Step 2: Save results as newResult object
                    console.log("response payload: ");
                    console.log(body);

                    const responseJSON = JSON.parse(body);
                    const interviewId = responseJSON.interviewId;
                    const testLabel = responseJSON.tests[0].label;
                    const diagnosis = responseJSON.tests[0].diagnosis;
                    const confidence = responseJSON.tests[0].confidence;
                    const severity = responseJSON.tests[0].severity;
                    const category = responseJSON.tests[0].category;
                    const precision = responseJSON.tests[0].precision;
                    const probability = responseJSON.tests[0].prob;
                    const percentile = responseJSON.tests[0].percentile;

                    const newResult = {
                        userId: userUpi,
                        interviewId: interviewId,
                        testType: testLabel,
                        diagnosis: diagnosis,
                        confidence: confidence,
                        severity: severity,
                        category: category,
                        precision: precision,
                        probability: probability,
                        percentile: percentile
                    };

                    console.log(newResult)
                    resolve(newResult)

                    // sendMessage({
                    //     text: "Test: " + testLabel + " (id " + interviewId + ")\nDiagnosis: " + diagnosis + "\nConfidence: " + confidence + "%"
                    //   });

                // Step 3: Save Results to mLab
                    // var newResult = new Result({
                    //     userId: userUpi,
                    //     interviewId: interviewId,
                    //     testType: testLabel,
                    //     diagnosis: diagnosis,
                    //     confidence: confidence,
                    //     severity: severity,
                    //     category: category,
                    //     precision: precision,
                    //     probability: probability,
                    //     percentile: percentile
                    // });

                    // newResult.save(function (err) {
                    //     if (err) {
                    //         console.log('Error on save! -- Results');
                    //     } else {
                    //         console.log('newResult model save successful');

                    //         // Step 4: Broadcast back to Chatfuel
                    //         // TODO: This logic should probably go elsewhere
                    //         suicideInterventionModule.suicideTrigger(userUpi, function (hasSuicideTrigger) {

                    //             console.log('SUICIDE INTERVENTION MODULE: Trigger? : ' + hasSuicideTrigger);
                    //             if (!hasSuicideTrigger) {
                    //                 DasbyActions.read("Survey Completed", 0, 0, userUpi);
                    //             }
                    //         })

                    //         // sendBroadcastSurveyCompleted(userUpi);
                    //     }
                    // });
                }
            }
        });
    })
}

function sendBroadcastSurveyCompleted(userUpi) {
    //vars

    // var botId = "599715bee4b025548973782f";
    // var userId = userUpi;
    // var token = "mELtlMAHYqR0BvgEiMq8zVek3uYUK3OJMbtyrdNPTrQB9ndV0fM7lWTFZbM4MZvD";
    // var blockName = "SURVEY COMPLETED";

    // var url = "https://api.chatfuel.com/bots/"+botId+"/users/"+userId+"/send?chatfuel_token="+token+"&chatfuel_block_name="+blockName;

    // request.post({
    //   headers: {
    //     'content-type': 'application/json;charset=utf-8',
    //     "accept": "application/json"
    //   },
    //   url: url,
    //   body: null
    // }, function(error, response, body) {
    //   if (error) {
    //     console.log(error);
    //   }
    //   else if (body) {
    //     console.log(body);
    //   };
    // });
}