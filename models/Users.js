/************************************************
 Imports 
************************************************/
const dbPool = require("../mysql/db");

/************************************************
 Tables 
************************************************/
const table = "users";

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
				const queryString = "SELECT * FROM users ORDER BY `createdAt`";
				connection.query(
					"SELECT * FROM users ORDER BY `createdAt`",
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
findAllWhere = function (searchObject) {
	return new Promise((resolve,reject) =>{
		dbPool.getConnection(function(error, connection){

			if (error) {
				console.log(error);
			}
			else{
				const queryString = 'SELECT * FROM ' +  table + ' WHERE ? ORDER BY `createdAt` DESC';
				connection.query(
				queryString,
				[searchObject],
				function(err, results) {
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

findOne = function (searchObject) {
	return new Promise((resolve,reject) =>{
		dbPool.getConnection(function(error, connection){

			if (error) {
				console.log(error);
			}
			else{
				const queryString = 'SELECT * FROM ' +  table + ' WHERE ? ORDER BY `createdAt` DESC LIMIT 1';
				connection.query(
				queryString,
				[searchObject],
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

update = function (searchObject, newData) {
	return new Promise((resolve,reject) =>{
		const newDate = getTimestamp(new Date());
		newData.updatedAt = newDate;
		
		dbPool.getConnection(function(error, connection){
			if (error) {
				console.log(error)
			}
			else{
				const queryString = 'UPDATE ' + table + ' SET ? WHERE ? ';
				connection.query(
					queryString, 
                    [newData, searchObject], 
					function (err, results) {
                        console.log("user model update results: ", results)
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

create = function(userData) {
	return new Promise((resolve,reject)=>{
		var date = getTimestamp(new Date());
		userData.createdAt = date;
		userData.updatedAt = date;	    	

		dbPool.getConnection(function(error, connection){
			if (error) {
				console.log(error)
			}
			else{
				let queryString = 'INSERT INTO ' + table + ' SET ?';
				connection.query(
					queryString, 
					userData, 
					function(err, results) {
                        console.log("user model create results: ", results)
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