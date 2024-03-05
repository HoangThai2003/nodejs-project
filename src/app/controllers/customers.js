// using basemodel
const baseModel = require("./base");
const date = require("date-and-time");
let actModel = require("./activity");
// return all data
module.exports.getAll = async () => {
    const sql = `SELECT *,UUID Id, DATE_FORMAT(ModifiedDate, "%Y/%m/%d %H:%i") DateModified,
    CASE when Ifnull(XuatVe0Dong,0) = 0 then 'Xuất toàn bộ'
	WHEN Ifnull(XuatVe0Dong,0) = 1 then 'Không xuất vé 0đ'
	WHEN Ifnull(XuatVe0Dong,0) = 2 then 'Không xuất vé miễn'
	ELSE 'Không xuất vé tập'END
	LoaiVeXuat , Ifnull(XuatVe0Dong,0) XuatVeKoDong, IsGPS,OrderPrint FROM Customers where Deleted = 0;`;
    console.log("sql edited " + sql);
    let result = await baseModel.execQuery("config")(sql);
    return result;
};
module.exports.getAllCustomers = async () => {
    const sql = `SELECT *,DATE_FORMAT(ModifiedDate, "%Y/%m/%d %H:%i") DateModified, UUID Id FROM Customers where Deleted = 0 and isAdmin = 0;`;
    console.log("sql edited " + sql);
    let result = await baseModel.execQuery("config")(sql);
    return result;
};
module.exports.getAllCustomerById = async (cusid) => {
    let where = "";
    if (cusid != "") where = `and UUID = '${cusid}'`;
    let sql = `SELECT *, UUID Id FROM Customers where Deleted = 0 ${where};`;
    // console.log("sql edited " + sql);
    let result = await baseModel.execQuery("config")(sql);
    return result;
};
module.exports.getUserName = async (uname) => {
    const sql = `SELECT UserName FROM Customers where UserName = ?;`;
    let result = await baseModel.execQuery("config")(sql, [uname]);
    return result;
};
module.exports.getUserId = async (uid) => {
    const sql = `SELECT *, UUID Id FROM Customers where UUID = ?;`;
    console.log(sql);
    let result = await baseModel.execQuery("config")(sql, [uid]);
    return result;
};
module.exports.getTaxCode = async (taxid) => {
    const sql = `SELECT TaxId FROM Customers where TaxId = ?;`;
    let result = await baseModel.execQuery("config")(sql, [taxid]);
    return result;
};
module.exports.getTaxId = async (taxid) => {
    const sql = `SELECT TaxId FROM Customers where TaxId = ?;`;
    let result = await baseModel.execQuery("config")(sql, [taxid]);
    return result;
};
module.exports.getByTaxId = async (taxid) => {
    const sql = `SELECT * FROM Customers where TaxId = ?;`;
    let result = await baseModel.execQuery("config")(sql, [taxid]);
    return result;
};
module.exports.getAllRole = async () => {
    const sql = `SELECT * from Roles;`;
    console.log("sql edited " + sql);
    let result = await baseModel.execQuery("config")(sql);
    return result;
};

module.exports.update = async (data, uId) => {
    var now = new Date();
    var userid = 1;
    var action = "Update ";
    var content = "Update Customers";
    let sql = await baseModel.createUpdateSql("Customers", data, uId);

    console.log(`createUpdateSql: {$uId} ` + sql);
    let result = await baseModel.execQuery("config")(sql, data);
    //var act = await model.addActivity(1,"Customer updated","Update customer information.");
    //console.log(" ------------ createUpdateSql controller: " + result);
    return result;
};
module.exports.insert = async (data, uId) => {
    let sql = await baseModel.createInsertSql("Customers", data, uId);
    //console.log(sql);
    let result = await baseModel.execQuery("config")(sql, data);
    console.log(result.insertId);
    return result;
};

module.exports.delete = async (id, uid) => {
    var _date = new Date();
    _date = date.format(_date, "YYYY/MM/DD HH:mm:ss");
    let sql =
        "Update Customers set Deleted = 1,ModifiedDate = ?,ModifiedBy = ? where Id = ?;";
    let result = await baseModel.execQuery(sql, [_date, uid, id]);
    return result;
};
