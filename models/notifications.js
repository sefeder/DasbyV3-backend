/************************************************
 Imports 
************************************************/
const dbPool = require("../mysql/db");

/************************************************
 Tables 
************************************************/
const table = "notification";

/************************************************
 Queries for User Controller
************************************************/
findAll = function () {
	return new Promise((resolve,reject) =>{
		dbPool.getConnection(function(error, connection) {
			if (error) {
				  console.log(error);
			}
			else{
				const queryString = "SELECT * FROM " + table + " ORDER BY `createdAt`";
				connection.query(
					queryString,
					[],
					function(err, results) {
						if (err) {
							console.log(err);
						}
						else{
							resolve(results);
							
						}
					}
				)
				dbPool.releaseConnection(connection);
			}
		});
	})
}

findOne = function (upi, surveyType) {
	return new Promise((resolve,reject) =>{
		dbPool.getConnection(function(error, connection){

			if (error) {
				console.log(error);
			}
			else{
				const queryString = 'SELECT * FROM ' +  table + ' WHERE `upi` = ? AND `surveyType` = ? ORDER BY `createdAt` DESC LIMIT 1';
				connection.query(
				queryString,
				[upi, surveyType],
				function(err, results) {
					if (err) {
						console.log(err);
					}
					else{
						resolve(results[0]);
					}
				}
				);
				dbPool.releaseConnection(connection);
			}
		});
	})
}

update = function (searchObject, setKey, setValue) {
	return new Promise((resolve,reject) =>{
		const newDate = JSON.stringify(getTimestamp(new Date()));
		dbPool.getConnection(function(error, connection){
			if (error) {
				console.log(error)
			}
			else{
				const queryString = 'UPDATE ' + table + ' SET `' + setKey + '` = ' + setValue +', `updatedAt` = ' + newDate +' WHERE ?';
				connection.query(
					queryString, 
                    [searchObject], 
					function (err, results) {
                        console.log("notifiaction model update results: ", results)
						if (err) {
							console.log(err);
						}
						else{
							resolve(results[0]);
						}
				});
				dbPool.releaseConnection(connection);
			}
		});
	})
}

create = function(notificationData) {
	return new Promise((resolve,reject)=>{
		var date = getTimestamp(new Date());
		notificationData.createdAt = date;
		notificationData.updatedAt = date;	    	

		dbPool.getConnection(function(error, connection){
			if (error) {
				console.log(error)
			}
			else{
				let queryString = 'INSERT INTO ' + table + ' SET ?';
				connection.query(
					queryString, 
					notificationData, 
					function(err, results) {
                        console.log("notification model create results: ", results)
						if (err) {
							console.log(err);
						}
						else{
							resolve(results);
						}
					}
				);
				dbPool.releaseConnection(connection);
			}
		});
	})
}

/************************************************
 Helpers 
************************************************/
function getTimestamp(date) {
	var newDate = date.getUTCFullYear() + '-' +
	    ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
	    ('00' + date.getUTCDate()).slice(-2) + ' ' + 
	    ('00' + date.getUTCHours()).slice(-2) + ':' + 
	    ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
	    ('00' + date.getUTCSeconds()).slice(-2);

	    return newDate;
}


/************************************************
 Modules 
************************************************/
module.exports = {findAll, findOne, findAllWhere, update, create}