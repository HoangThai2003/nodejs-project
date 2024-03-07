const date = require("date-and-time");
const {v4: uuidv4} = require("uuid");

const mysql = require("promise-mysql");
const {logger} = require("../config/logger");

// Formatting the date and time
// by using date.format() method
let poolConnectionConfig;
let poolConnectionRead;
let poolConnectionWrite;
let poolConnectionInvoice;
let poolConnectionGPS;
let poolConnectionLogRequest;
let poolConnectionInvoiceBackup;
const initDB = async () => {
    const poolConnectionList = await Promise.all([
        mysql.createPool({
            host: process.env.DB_HOST_CONFIG,
            port: process.env.DB_PORT_CONFIG,
            database: process.env.DB_NAME_CONFIG,
            user: process.env.DB_USER_CONFIG,
            password: process.env.DB_PASS_CONFIG,
            multipleStatements: true,
            // [START cloud_sql_mysql_mysql_limit]
            // 'connectionLimit' is the maximum number of connections the pool is allowed
            // to keep at once.
            connectionLimit: 200,
            // [END cloud_sql_mysql_mysql_limit]

            // [START cloud_sql_mysql_mysql_timeout]
            // 'connectTimeout' is the maximum number of milliseconds before a timeout
            // occurs during the initial connection to the database.
            connectTimeout: 60 * 60 * 60 * 1000, // 10 seconds
            // 'acquireTimeout' is the maximum number of milliseconds to wait when
            // checking out a connection from the pool before a timeout error occurs.
            acquireTimeout: 60 * 60 * 60 * 1000, // 10 seconds
            // 'waitForConnections' determines the pool's action when no connections are
            // free. If true, the request will queued and a connection will be presented
            // when ready. If false, the pool will call back with an error.
            timeout: 60 * 60 * 60 * 1000,
            waitForConnections: true, // Default: true
            // 'queueLimit' is the maximum number of requests for connections the pool
            // will queue at once before returning an error. If 0, there is no limit.
            queueLimit: 0, // Default: 0
        }),
        mysql.createPool({
            host: process.env.DB_HOST_READ,
            port: process.env.DB_PORT_READ,
            database: process.env.DB_NAME_READ,
            user: process.env.DB_USER_READ,
            password: process.env.DB_PASS_READ,
            multipleStatements: true,
            // [START cloud_sql_mysql_mysql_limit]
            // 'connectionLimit' is the maximum number of connections the pool is allowed
            // to keep at once.
            connectionLimit: 100,
            // [END cloud_sql_mysql_mysql_limit]

            // [START cloud_sql_mysql_mysql_timeout]
            // 'connectTimeout' is the maximum number of milliseconds before a timeout
            // occurs during the initial connection to the database.
            connectTimeout: 60 * 60 * 60 * 1000, // 10 seconds
            // 'acquireTimeout' is the maximum number of milliseconds to wait when
            // checking out a connection from the pool before a timeout error occurs.
            acquireTimeout: 60 * 60 * 60 * 1000, // 10 seconds
            // 'waitForConnections' determines the pool's action when no connections are
            // free. If true, the request will queued and a connection will be presented
            // when ready. If false, the pool will call back with an error.
            timeout: 60 * 60 * 60 * 1000,
            waitForConnections: true, // Default: true
            // 'queueLimit' is the maximum number of requests for connections the pool
            // will queue at once before returning an error. If 0, there is no limit.
            queueLimit: 0, // Default: 0
        }),
        mysql.createPool({
            host: process.env.DB_HOST_WRITE,
            port: process.env.DB_PORT_WRITE,
            database: process.env.DB_NAME_WRITE,
            user: process.env.DB_USER_WRITE,
            password: process.env.DB_PASS_WRITE,
            multipleStatements: true,
            // [START cloud_sql_mysql_mysql_limit]
            // 'connectionLimit' is the maximum number of connections the pool is allowed
            // to keep at once.
            connectionLimit: 100,
            // [END cloud_sql_mysql_mysql_limit]

            // [START cloud_sql_mysql_mysql_timeout]
            // 'connectTimeout' is the maximum number of milliseconds before a timeout
            // occurs during the initial connection to the database.
            connectTimeout: 60 * 60 * 60 * 1000, // 10 seconds
            // 'acquireTimeout' is the maximum number of milliseconds to wait when
            // checking out a connection from the pool before a timeout error occurs.
            acquireTimeout: 60 * 60 * 60 * 1000, // 10 seconds
            // 'waitForConnections' determines the pool's action when no connections are
            // free. If true, the request will queued and a connection will be presented
            // when ready. If false, the pool will call back with an error.
            timeout: 60 * 60 * 60 * 1000,
            waitForConnections: true, // Default: true
            // 'queueLimit' is the maximum number of requests for connections the pool
            // will queue at once before returning an error. If 0, there is no limit.
            queueLimit: 0, // Default: 0
        }),
        mysql.createPool({
            host: process.env.DB_HOST_INVOICE,
            port: process.env.DB_PORT_INVOICE,
            database: process.env.DB_NAME_INVOICE,
            user: process.env.DB_USER_INVOICE,
            password: process.env.DB_PASS_INVOICE,
            multipleStatements: true,
            // [START cloud_sql_mysql_mysql_limit]
            // 'connectionLimit' is the maximum number of connections the pool is allowed
            // to keep at once.
            connectionLimit: 100,
            // [END cloud_sql_mysql_mysql_limit]

            // [START cloud_sql_mysql_mysql_timeout]
            // 'connectTimeout' is the maximum number of milliseconds before a timeout
            // occurs during the initial connection to the database.
            connectTimeout: 60 * 60 * 60 * 1000, // 10 seconds
            // 'acquireTimeout' is the maximum number of milliseconds to wait when
            // checking out a connection from the pool before a timeout error occurs.
            acquireTimeout: 60 * 60 * 60 * 1000, // 10 seconds
            // 'waitForConnections' determines the pool's action when no connections are
            // free. If true, the request will queued and a connection will be presented
            // when ready. If false, the pool will call back with an error.
            timeout: 60 * 60 * 60 * 1000,
            waitForConnections: true, // Default: true
            // 'queueLimit' is the maximum number of requests for connections the pool
            // will queue at once before returning an error. If 0, there is no limit.
            queueLimit: 0, // Default: 0
        }),
        mysql.createPool({
            host: process.env.DB_HOST_GPS,
            port: process.env.DB_PORT_GPS,
            database: process.env.DB_NAME_GPS,
            user: process.env.DB_USER_GPS,
            password: process.env.DB_PASS_GPS,
            multipleStatements: true,
            // [START cloud_sql_mysql_mysql_limit]
            // 'connectionLimit' is the maximum number of connections the pool is allowed
            // to keep at once.
            connectionLimit: 100,
            // [END cloud_sql_mysql_mysql_limit]

            // [START cloud_sql_mysql_mysql_timeout]
            // 'connectTimeout' is the maximum number of milliseconds before a timeout
            // occurs during the initial connection to the database.
            connectTimeout: 60 * 60 * 60 * 1000, // 10 seconds
            // 'acquireTimeout' is the maximum number of milliseconds to wait when
            // checking out a connection from the pool before a timeout error occurs.
            acquireTimeout: 60 * 60 * 60 * 1000, // 10 seconds
            // 'waitForConnections' determines the pool's action when no connections are
            // free. If true, the request will queued and a connection will be presented
            // when ready. If false, the pool will call back with an error.
            timeout: 60 * 60 * 60 * 1000,
            waitForConnections: true, // Default: true
            // 'queueLimit' is the maximum number of requests for connections the pool
            // will queue at once before returning an error. If 0, there is no limit.
            queueLimit: 0, // Default: 0
        }),
        mysql.createPool({
            host: process.env.DB_HOST_GPS,
            port: process.env.DB_PORT_GPS,
            database: process.env.DB_NAME_LOG,
            user: process.env.DB_USER_GPS,
            password: process.env.DB_PASS_GPS,
            multipleStatements: true,
            // [START cloud_sql_mysql_mysql_limit]
            // 'connectionLimit' is the maximum number of connections the pool is allowed
            // to keep at once.
            connectionLimit: 100,
            // [END cloud_sql_mysql_mysql_limit]

            // [START cloud_sql_mysql_mysql_timeout]
            // 'connectTimeout' is the maximum number of milliseconds before a timeout
            // occurs during the initial connection to the database.
            connectTimeout: 60 * 60 * 60 * 1000, // 10 seconds
            // 'acquireTimeout' is the maximum number of milliseconds to wait when
            // checking out a connection from the pool before a timeout error occurs.
            acquireTimeout: 60 * 60 * 60 * 1000, // 10 seconds
            // 'waitForConnections' determines the pool's action when no connections are
            // free. If true, the request will queued and a connection will be presented
            // when ready. If false, the pool will call back with an error.
            timeout: 60 * 60 * 60 * 1000,
            waitForConnections: true, // Default: true
            // 'queueLimit' is the maximum number of requests for connections the pool
            // will queue at once before returning an error. If 0, there is no limit.
            queueLimit: 0, // Default: 0
        }),
        mysql.createPool({
            host: process.env.DB_HOST_INVOICE_BACKUP,
            port: process.env.DB_PORT_INVOICE_BACKUP,
            database: process.env.DB_NAME_INVOICE_BACKUP,
            user: process.env.DB_USER_INVOICE_BACKUP,
            password: process.env.DB_PASS_INVOICE_BACKUP,
            multipleStatements: true,
            // [START cloud_sql_mysql_mysql_limit]
            // 'connectionLimit' is the maximum number of connections the pool is allowed
            // to keep at once.
            connectionLimit: 100,
            // [END cloud_sql_mysql_mysql_limit]

            // [START cloud_sql_mysql_mysql_timeout]
            // 'connectTimeout' is the maximum number of milliseconds before a timeout
            // occurs during the initial connection to the database.
            connectTimeout: 60 * 60 * 60 * 1000, // 10 seconds
            // 'acquireTimeout' is the maximum number of milliseconds to wait when
            // checking out a connection from the pool before a timeout error occurs.
            acquireTimeout: 60 * 60 * 60 * 1000, // 10 seconds
            // 'waitForConnections' determines the pool's action when no connections are
            // free. If true, the request will queued and a connection will be presented
            // when ready. If false, the pool will call back with an error.
            timeout: 60 * 60 * 60 * 1000,
            waitForConnections: true, // Default: true
            // 'queueLimit' is the maximum number of requests for connections the pool
            // will queue at once before returning an error. If 0, there is no limit.
            queueLimit: 0, // Default: 0
        }),
    ]);
    poolConnectionConfig = poolConnectionList[0];
    poolConnectionRead = poolConnectionList[1];
    poolConnectionWrite = poolConnectionList[2];
    poolConnectionInvoice = poolConnectionList[3];
    poolConnectionGPS = poolConnectionList[4];
    poolConnectionLogRequest = poolConnectionList[5];
    poolConnectionInvoiceBackup = poolConnectionList[6];
};

const getPoolByType = (type) => {
    let poolConnection;
    switch (type) {
        case "config":
            poolConnection = poolConnectionConfig;
            break;
        case "read":
            poolConnection = poolConnectionRead;
            break;
        case "write":
            poolConnection = poolConnectionWrite;
            break;
        case "invoice":
            poolConnection = poolConnectionInvoice;
            break;
        case "gps":
            poolConnection = poolConnectionGPS;
            break;
        case "logrequest":
            poolConnection = poolConnectionLogRequest;
            break;
        case "invoicebackup":
            poolConnection = poolConnectionInvoiceBackup;
            break;
    }
    return poolConnection;
};
const getPoolConnection = (type) => async () => {
    let poolConnection = getPoolByType(type);
    if (!poolConnection) {
        await initDB();
        poolConnection = getPoolByType(type);
    }
    return poolConnection;
};

let writeSystemLog = async (error) => {
    let param = [].push(error);
    let sql = `call SystemLog_AddNew(?)`;
    test = new Promise((resolve, reject) => {
        con.query(sql, param, (err, result, field) => {
            if (!result) {
                reject(err);
            } else {
                // logger.debug(result);
                resolve(result);
            }
            con.release();
        });
    });
    let dataReturn;
    // await test
    // 	.then((d) => {
    // 		dataReturn = d;
    // 	})
    // 	.catch((e) => dataReturn = e);
};

//storename: ten store
//data: du lieu truyen vao theo array,
// return state: 1 la return array, 0 la return 1 gia tri

function convertBodyToArray(body) {
    let spparams = [];
    logger.debug(`Running on convertBodyToArray 1`);
    for (let key in body) {
        if (body.hasOwnProperty(key)) {
            let value = body[key];
            spparams.push(value);
        }
    }
    logger.debug(`Running on convertBodyToArray 2`);
    return spparams;
}

// Return 2D Array of object
let execStore = async (storeName, dataInput) => {
    try {
        let data = convertBodyToArray(dataInput);
        // poolConnection.connect(function (err) {
        // 	if (err) logger.debug(err)
        // 	else require("../config/logger").info("Database Connected!");
        // });
        //await logger.debug(data);
        let sql = `call ${storeName}()`;
        await logger.debug(await data);
        if (data) {
            let queryString = await "";
            for (let i = 0; i < data.length; i++) {
                queryString += await ",?";
            }
            queryString = await queryString.substring(1, queryString.length);
            sql = await `call ${storeName}(${queryString})`;
        }
        logger.debug(sql);

        let dataReturn;
        let test;
        if (!data) {
            logger.debug(`Running on dataless`);
            try {
                dataReturn = await poolConnection.query(sql);
                delete dataReturn.OkPacket;
                return dataReturn;
            } catch (e) {
                throw new Error(e);
            }
        } else {
            logger.debug(`Running on datapull`);

            try {
                dataReturn = await poolConnection.query(sql, data);
                delete dataReturn.OkPacket;
                return dataReturn;
            } catch (e) {
                throw new Error(e);
            }
        }
    } catch (error) {
        //writeSystemLog();
        // require("../config/logger").info("Base.execStore " + storeName + " Error " + error);
        // logger.telelog(e);
        throw error;
    }
};

//storename: sp name
//data: data by object
// return state: return 1D array of object
let execQuery = (type) => async (sql, dataInput) => {
    try {
        let data = dataInput;
        const poolConnection = await getPoolConnection(type)();
        //let data = convertBodyToArray(dataInput);
        //logger.debug("Calling in execQuery!");
        // let con = createMySQLCon();
        // con.connect(function (err) {
        // 	if (err)
        // 		require("../config/logger").info("Cannot connect to Databse" + err);
        // });
        let dataReturn;
        if (!data) {
            try {
                dataReturn = await poolConnection.query(sql);
                delete dataReturn.OkPacket;
                return dataReturn;
            } catch (e) {
                throw new Error(e);
            }
        } else {
            //logger.debug(`Running on data`);
            try {
                dataReturn = await poolConnection.query(sql, data);
                delete dataReturn.OkPacket;
                return dataReturn;
            } catch (e) {
                throw new Error(e);
            }
        }
    } catch (error) {
        //writeSystemLog();
        throw error;
    }
};

async function createInsertSql(tableName, object, uId, UUID) {
    try {
        const columns = Object.keys(object);
        const values = Object.values(object);
        const uuid = UUID || uuidv4();
        logger.debug(columns);
        logger.debug(values);
        let sqlcolumn = "";
        let sqlvalue = "";
        for (let i = 1; i < values.length; i++) {
            if (
                values[i] == null ||
                values[i] == "0NaN/NaN/NaN" ||
                values[i] == "" ||
                values[i] == "NaN/NaN/NaN"
            ) {
                continue;
            } else {
                const strVal = values[i];
                try {
                    if (strVal.indexOf('"') >= 0) {
                        strVal =
                            `"` +
                            strVal.replace('"', "'").replace('"', "'") +
                            `"`;
                    }
                } catch {}

                sqlvalue += `'` + strVal + `'`;
                sqlcolumn += "`" + columns[i] + "`";
                if (i !== values.length - 1) {
                    sqlvalue += ",";
                    sqlcolumn += ",";
                }
            }

            //logger.debug(sqlcolumn);
            //logger.debug(sqlvalue);
        }
        let _Date = new Date();
        _Date = date.format(_Date, "YYYY/MM/DD HH:mm:ss");

        let sql =
            `INSERT INTO ` +
            tableName +
            `  (` +
            sqlcolumn +
            `,UUID,CreatedDate,CreatedBy,ModifiedDate,ModifiedBy) VALUES (` +
            sqlvalue +
            `,"` +
            uuid +
            `","` +
            _Date +
            `","` +
            uId +
            `","` +
            _Date +
            `","` +
            uId +
            `");`;

        sql = sql.replace(",,", ",").replace(",,", ",");
        logger.debug(sql);
        return sql;
    } catch (ex) {
        logger.debug(ex);
        return "";
    }
}
async function createUpdateSql(tableName, object, uId) {
    const columns = Object.keys(object);
    const values = Object.values(object);
    let _Date = new Date();
    _Date = date.format(_Date, "YYYY/MM/DD HH:mm:ss");
    let sqlcolumn = "";
    var uuid = "";
    if (typeof object.Id !== "undefined" && object.Id) {
        uuid = object.Id;
    } else {
        uuid = object.UUID;
    }
    for (let i = 1; i < values.length; i++) {
        //logger.debug("=====================" +  values[i]);
        if (values[i] == null || values[i] == "0NaN/NaN/NaN") {
            continue;
        } else {
            sqlcolumn += "`" + columns[i] + '` =  "' + values[i] + '"';
            if (i !== values.length - 1) {
                sqlcolumn += ",";
            }
        }

        //logger.debug("=====================" + sqlcolumn);
    }
    let sql =
        `UPDATE ` +
        tableName +
        `  SET ` +
        sqlcolumn +
        `,ModifiedDate="` +
        _Date +
        `", ModifiedBy= "${uId}" where UUID = "${uuid}";`;
    sql = sql.replace(",,", ",");
    //logger.debug("---------------------- Create Update SQL ------------------------------");
    logger.debug(sql);
    return sql;
}

function isDate(date) {
    const _regExp = new RegExp(
        "^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$",
    );
    return _regExp.test(date);
}
async function createActivitySql(userid, action, content) {
    const datecreate = new Date();
    const sql =
        "INSERT INTO `activities` (`userid`, `createdate`, `action`, `note`) VALUES ('" +
        userid +
        "', '" +
        date.format(datecreate, "YYYY/MM/DD HH:mm:ss") +
        "', '" +
        action +
        "', '" +
        content +
        "');";
    //logger.debug("---------------------------------- Activity:  " + sql);
    return sql;
}

let model = {
    execStore: execStore,
    execQuery: execQuery,
    createInsertSql: createInsertSql,
    createUpdateSql: createUpdateSql,
    createActivitySql: createActivitySql,
    getPoolConnection,
};

module.exports = model;
