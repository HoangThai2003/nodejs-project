var baseMdl = require("./models/base");
const axios = require("axios");
const https = require("https");
const {func} = require("joi");
// var stringify = require('csv-stringify');

// var stringifier = new stringify.Stringifier();

// // const fs = require('fs');

// // const outputStream = fs.createWriteStream('output.csv', {encoding: 'utf8'});

var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "172.16.10.83",
    user: "vdsi",
    password: "Vdsi@2023",
    database: "vebus_invoice",
    dateStrings: true,
    // stringifyObjects: true,
    supportBigNumbers: true,
    //  debug: true
});
var connectionbackup = mysql.createConnection({
    host: "172.16.10.88",
    user: "vdsi",
    password: "Vdsi@2023",
    database: "vebus_invoice",
    dateStrings: true,
    // stringifyObjects: true,
    supportBigNumbers: true,
    //  debug: true
});
connection.connect();
connectionbackup.connect();
// // // // // connection.query('SELECT * from  person', function (error, results, fields) {
// // // // //   if (error) throw error;
// // // // //   console.log('The solution is: ', results);
// // // // // });

// // // // connection.query('SELECT * FROM InvoiceAlls').stream().on('end', () => {
// // // //   connection.end();
// // // // }).pipe(stringifier).pipe(outputStream);

// // // // const mysql = require('mysql');
const stream = require("stream");
// baseMdl.execQuery('invoice')('SELECT * FROM InvoiceAlls  where year(CreatedDate) = 2024;')
function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

var _curr = 0;
var _i = 0;
var _day = 1;
var _month = 1;
var _data = "";
// connection.query(`SELECT *,ifnull(SignedDate,CreatedDate),ifnull(InvType,isOffline) InvoiceType DateSigned FROM InvoiceAlls  where year(CreatedDate) = 2024 and month(CreatedDate) = ${_month} and day(CreatedDate) = ${_day} ;`)
async function DoCopy() {
    await connection
        .query(
            `SELECT *,ifnull(SignedDate,CreatedDate) DateSigned,ifnull(InvType,isOffline) InvoiceType FROM InvoiceAlls  where year(CreatedDate) = 2024;`,
        )
        .on("error", function (err) {
            // Do something about error in the query
        })
        .stream()
        .pipe(
            new stream.Transform({
                objectMode: true,
                transform: async function (row, encoding, callback) {
                    // Do something with the row of data
                    // console.log(JSON.stringify(row));

                    await insertInv(row);
                    await callback();
                },
            }),
        )
        .on("finish", async function () {
            await post1Invoice(_data);
            _data = "";
            _i = 0;
            connection.end();
            connectionbackup.end();
        });
}
DoCopy();
async function insertInv(row) {
    _i++;
    if (_i < 5001) {
        _data += `('${row.UUID}','${row.CustomerId}','${row.InvKey}','${row.InvRef}','${row.InvPattern}','${row.InvSerial}',${row.InvoiceType},${row.Amount},'${row.AmountInWords}','${row.DateSigned}',${row.Status},'${row.InvoiceNo}','${row.CreatedBy}','${row.CreatedDate}','${row.ModifiedBy}','${row.ModifiedDate}',${row.pushCount},'${row.pushLog}',${row.PushType},'${row.RouteNumber}','${row.ResponseMessage}','${row.RFID}',${row.isOffline}),`;
    } else {
        _data = _data.substring(0, _data.length - 1);
        _i = 0;
        var ret = await post1Invoice(_data);
        _curr++;
        _data = "";
        log(
            `Insert ${_curr} data [${_day}-${_month}-2024]. Last UUID: ${
                row.UUID
            }. AffectedRows: ${JSON.stringify(ret.affectedRows)}`,
        );
        //  return ret;
    }

    // var sql = `INSERT INTO  InvoiceAll2024 (
    //     UUID,CustomerId,InvKey,InvRef,InvPattern,InvSerial,InvType,
    //     Amount,AmountInWords,SignedDate,Status,InvoiceNo,CreatedBy,CreatedDate,
    //     ModifiedBy,ModifiedDate,pushCount, pushLog,PushType,RouteNumber,
    //     ResponseMessage,RFID,isOffline)
    //     VALUES('${row.UUID}','${row.CustomerId}','${row.InvKey}','${row.InvRef}','${row.InvPattern}','${row.InvSerial}',${row.InvoiceType},${row.Amount},'${row.AmountInWords}','${row.DateSigned}',${row.Status},'${row.InvoiceNo}','${row.CreatedBy}','${row.CreatedDate}','${row.ModifiedBy}','${row.ModifiedDate}',${row.pushCount},'${row.pushLog}',${row.PushType},'${row.RouteNumber}','${row.ResponseMessage}','${row.RFID}',${row.isOffline})
    //     ;`;
    //     console.log(sql);
    //     // var ret = await baseMdl.execQuery("invoicebackup")(sql);
    //     var ret= await connectionbackup.query(sql);
    // await connectionbackup.connect();
    // var ret= await connectionbackup.query(sql,[row.UUID,row.CustomerId,row.InvKey,row.InvRef,row.InvPattern,row.InvSerial,row.InvType,row.Amount,row.AmountInWords,row.SignedDate,row.Status,row.InvoiceNo,row.CreatedBy,row.CreatedDate,row.ModifiedBy,row.ModifiedDate,row.pushCount,row.pushLog,row.PushType,row.RouteNumber,row.ResponseMessage,row.RFID,row.isOffline,row.Note]);
    // console.log("Inserted: " + row.UUID);
    // await connectionbackup.end();
}

//   '${row.UUID}','${row.CustomerId}','${row.InvKey}','${row.InvRef}','${row.InvPattern}','${row.InvSerial}',${row.InvType},
//   ${row.Amount},'${row.AmountInWords}','${row.SignedDate}',${row.Status},'${row.InvoiceNo}','${row.CreatedBy}','${row.CreatedDate}',
//   '${row.ModifiedBy}','${row.ModifiedDate}',${row.pushCount},'${row.pushLog}',${row.PushType},'${row.RouteNumber}',
//   '${row.ResponseMessage}','${row.RFID}',${row.isOffline},'${row.Note}');`
//   console.log(sql);

function log(str) {
    var _date = getTodayLocal() + " " + newTime();
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`[${_date}] ${str}`);
}
function newTime() {
    var date = new Date();
    return `${("0" + date.getHours()).slice(-2)}:${(
        "0" + date.getMinutes()
    ).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}:${date
        .getMilliseconds()
        .toString()
        .slice(-2)}`;
}
function getTodayLocal() {
    var date = new Date();
    var month = "0" + (date.getMonth() + 1);
    var day = "0" + date.getDate();
    var ret = `${day.slice(-2)}/${month.slice(-2)}/${date.getFullYear()}`;
    return ret;
}

async function post1Invoice(data) {
    try {
        var ret;
        var urlhoadon = "http://localhost:4000/auth/copy1invoice";
        const options = {
            url: urlhoadon,
            method: "POST",
            data: data,
        };
        await axios(options)
            .then((response) => {
                var json = JSON.stringify(response.data);
                // console.log(json);
                ret = response.data;
            })
            .catch((err) => {
                ret = {message: false};
            });
    } catch (e) {
        // console.log(e);
    }
    // console.log(ret);
    return ret;
}
