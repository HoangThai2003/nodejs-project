
const e = require("express");

let modelCustomers = require("../models/customers");
let midleware = require("../config/midleware");
const date = require('date-and-time');
var { logger } = require("../config/logger");
let homeModel = require("../models/home");
let modelStaff = require("../models/staffs");
//Rendring home ejs
module.exports.home = async function (req, res) {

    try {
        // let customers = await modelCustomers.getAll();

        //console.log(staffs);
        return res.render("customers/home", {
            title: "Customer List",
            // customers: customers,
            user: req.session,
            message: req.session.returnMsg
        });

    } catch (e) {
        console.log(e);
        logger.telelog(e);
        //res.status(500).render;
    }

};



//Rendring home ejs
module.exports.customerProfiles = async function (req, res) {

    try {
        var totalStaffs = 0;
        var totalVehicles = 0;
        var totalDevices = 0;
        var totalRoutes = 0;
        var id = req.params.id;
        var total;
        var p = Promise.all([modelCustomers.getUserId(id), homeModel.getTotalHome(id), modelStaff.getAll(id), modelStaff.getAllRole()]);
        p.then(function (arrayOfResults) {
            const [customer, totals, staffs, roles] = arrayOfResults;
            //console.log(arrayOfResults);
            return res.render("profiles/home", {
                title: "Customer List",
                totalStaffs: totals.Staffs,
                totalVehicles: totals.Vehicles,
                totalDevices: totals.Devices,
                totalRoutes: totals.Routes,
                staffs: staffs,
                roles: roles,
                customer: customer[0],
                CusId: id,
                user: req.session,
            });
        });


    } catch (e) {
        console.log(e);
        // logger.telelog(e);
        //res.status(500).render;
    }

};

module.exports.add = async function (req, res) {

    try {
        let ret;
        var dataObj = {
            Id: req.body.Id,
            Name: req.body.Name,
            UserName: req.body.UserName,
            Password: req.body.Password,
            IsAdmin: req.body.IsAdmin == 1?1:0,
            TaxId: req.body.TaxId,
            Email: req.body.Email,
            Address: req.body.Address,
            PushType: req.body.PushType,
            Deleted: req.body.Deleted,
            InvoiceUrl: req.body.InvoiceUrl,
            InvoiceUser: req.body.InvoiceUser,
            InvoicePass: req.body.InvoicePass,
            InvPattern: req.body.InvPattern,
            InvSerial: req.body.InvSerial,
            XuatVe0Dong: req.body.XuatVe0Dong,
            StatisticNumberEnd: req.body.StatisticNumberEnd,
            Gateway:req.body.Gateway,
            IsGPS: req.body.IsGPS,
            InvSearchUrl: req.body.InvSearchUrl,
            StatisticNumberStart: (parseInt(req.body.StatisticNumberEnd) - 1) + "",
            OrderPrint: req.body.OrderPrint
        };
        console.log(req.body);

        if (req.body.Id != 0)
            ret = await modelCustomers.update(dataObj, 0);
        else {
            ret = await modelCustomers.insert(dataObj, 0);
        }
        //console.log(ret);
        res.json("ok");

    } catch (e) {
        console.log(e);
        logger.telelog(e);
        //res.status(500).render;
    }

};

module.exports.delete = async function (req, res) {

    try {
        var id = req.params.id;
        console.log("------------------------------------------ Del customer " + id);
        let ret = await modelCustomers.delete(id);
        res.redirect("/customers");
    } catch (e) {
        console.log(e);
    }

};
module.exports.getCusByUserName = async function (req, res) {
    try {
        var uname = req.params.uname;
        var user = await modelCustomers.getUserName(uname).length;
        //console.log(OkPacket);
        res.json(user);
    } catch (e) {
        logger.telelog(e);
    }

};
module.exports.getAll = async function (req, res) {
    try {
        let customers = await modelCustomers.getAll();
        //console.log(OkPacket);
        res.json(customers);
    } catch (e) {
        logger.telelog(e);
    }

};


module.exports.getTaxCode = async function (req, res) {
    try {
        var taxid = req.params.taxid;
        var user = await modelCustomers.getUserName(taxid).length;
        //console.log(OkPacket);
        res.json(user);
    } catch (e) {
        logger.telelog(e);
    }

};

module.exports.getByTaxCode = async function (taxid) {
    try {
        var user = await modelCustomers.getUserName(taxid).length;
        res.json(user);
    } catch (e) {
        logger.telelog(e);
    }
};

