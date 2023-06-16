/*
    Allows Javascript to run Python - connects the server to a database (operations listed below)

    Commands:
        checkDB: Reads and returns information from the database for further processing    
        updateDB: Creates/modifies data in the database
*/
    let {PythonShell} = require('python-shell');


class DBAdapter {

    async checkDB(options) {
        let result = new Promise((resolve, reject) => {
            PythonShell.run('PostgreSQL/DB.py', options, function (err, result) {
                if (err) return reject(err);
                return resolve(result)
            });
        });

        return result;
    }

    updateDB(options) {
        PythonShell.run('PostgreSQL/DB.py', options, function (err) {
            if(err) console.log(err);
            console.log('Updated Succesfully!');
        });
    }
}
 

module.exports = {
    DBAdapter
}