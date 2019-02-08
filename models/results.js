/************************************************
 Imports 
************************************************/
const dbPool = require("../mysql/db");

/************************************************
 Tables 
************************************************/
const table = "results";

/************************************************
 Queries 
************************************************/


/************************************************
 Search
************************************************/
// findOne = function (searchObject) {
//     return new Promise((resolve, reject) => {
//         dbPool.getConnection(function (error, connection) {
//             if (error) {
//                 console.log(error);
//             }
//             else {
//                 var queryString = 'SELECT * FROM ' + table + ' WHERE ? ORDER BY `createdAt` DESC LIMIT 1';
//                 connection.query(
//                     queryString,
//                     [searchObject],
//                     function (err, results) {
//                         if (err) {
//                             console.log(err);
//                         }
//                         else {
//                             console.log('===============================')
//                             console.log('results in dia.find: ', results)
//                             console.log('=============================')
//                             resolve(results);
//                         }
//                     }
//                 );
//                 dbPool.releaseConnection(connection);
//             }
//         });
//     })

// }

find = function (searchObjectOne, searchObjectTwo) {
    return new Promise((resolve, reject) => {
        dbPool.getConnection(function (error, connection) {
            if (error) {
                console.log(error);
            }
            else {
                var queryString = 'SELECT * FROM ' + table + ' WHERE ? AND ? ORDER BY `createdAt` DESC LIMIT 24';
                connection.query(
                    queryString,
                    [searchObjectOne, searchObjectTwo],
                    function (err, results) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log('===============================')
                            console.log('results in dia.find: ', results)
                            console.log('=============================')
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
 Saving/Creating new Result 
************************************************/
create = function (resultData) {
    return new Promise((resolve, reject) => {
        var date = getTimestamp(new Date());
        resultData.createdAt = date;
        resultData.updatedAt = date;

        dbPool.getConnection(function (error, connection) {
            if (error) {
                console.log(error)
            }
            else {
                let queryString = 'INSERT INTO ' + table + ' SET ?';
                connection.query(
                    queryString,
                    resultData,
                    function (err, results) {
                        console.log("result model create results: ", results)
                        if (err) {
                            console.log(err);
                        }
                        else {
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
        ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' +
        ('00' + date.getUTCHours()).slice(-2) + ':' +
        ('00' + date.getUTCMinutes()).slice(-2) + ':' +
        ('00' + date.getUTCSeconds()).slice(-2);

    return newDate;
}

/************************************************
 Modules 
************************************************/
module.exports = { find, create }