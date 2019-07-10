/************************************************
 Imports 
************************************************/
const dbPool = require("../mysql/db");

/************************************************
 Tables 
************************************************/
const table = "dialogue";

/************************************************
 Queries 
************************************************/
find = function (chapter, section, block) {
    return new Promise((resolve, reject) => {
    dbPool.getConnection(function(error, connection) {
            if (error) {
                console.log(error);
            }
            else{
                const queryString = 'SELECT * FROM ' +  table + ' WHERE `chapter` = ? AND `section` = ? AND `block` > ? ORDER BY `block`';
                connection.query(
                    queryString,
                    [chapter, section, block-1],
                    function(err, results) {
                        if (err) {
                            console.log(err);
                        }
                        else{
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
 Modules 
************************************************/
module.exports = {find}